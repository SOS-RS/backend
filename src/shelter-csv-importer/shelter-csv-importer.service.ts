import { Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Readable, Transform } from 'node:stream';
import { TransformStream } from 'node:stream/web';

import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShelterSchema } from '../shelter/types/types';
import {
  AtomicCounter,
  createCsvParser,
  detectSupplyCategoryUsingAI,
  responseToReadable,
  translatePrismaError,
} from './shelter-csv-importer.helpers';
import {
  CsvToShelterTransformStream,
  ShelterEnhancedStreamTransformer,
} from './shelter-csv.transformer';
import {
  CSV_DEFAULT_HEADERS,
  ParseCsvArgs,
  ShelterColumHeader,
  ShelterInput,
} from './types';

@Injectable()
export class ShelterCsvImporterService {
  private readonly logger = new Logger(ShelterCsvImporterService.name);
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * ```js
   *  // Pode ser uma stream de arquivo
   *  const fileSourceStream = createReadStream(__dirname + '/planilha_porto_alegre - comida.csv');
   *  // Ou uma url de um arquivo CSV
   *  const csvUrl = 'https://docs.google.com/spreadsheets/d/18hY52i65lIdLE2UsugjnKdnE_ubrBCI6nCR0XQurSBk/gviz/tq?tqx=out:csv&sheet=planilha_porto_alegre';
   * // passar os headers
   *  parseCsv({fileStream: fileSourceStream, csvUrl,headers:{ nameField:'nome' ,addressField:'endereco',latitudeField:'lat'}})
   * ```
   *
   */
  async execute({
    headers = CSV_DEFAULT_HEADERS,
    csvUrl,
    fileStream,
    dryRun = false,
    useIAToPredictSupplyCategories = true,
    useBatchTransaction = false,
    onEntity,
  }: ParseCsvArgs<ShelterColumHeader> & {
    /**
     * Se deverá usar alguma LLM para tentar categorizar as categorias dos suprimentos
     * @implNote por enquanto apenas `Gemini` foi implementada.
     */
    useIAToPredictSupplyCategories?: boolean;
    /**
     *
     * callback executado após cada entidade ser criada ou ser validada (caso `dryRun` seja true)
     *
     * ** NÃO será executada caso `useBatchTransaction` seja true
     */
    onEntity?: (
      shelter: ReturnType<
        (typeof CreateShelterSchema)['parse'] & { id?: string }
      >,
    ) => void;
    /**
     * Se true, guardará todas as criações em memória e executará elas em um batch `$transaction`
     *  [Prisma $transaction docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
     */
    useBatchTransaction?: boolean;
  }) {
    this.validateInput(csvUrl, fileStream);

    const efffectiveColumnNames = this.getEffectiveColumnNames(headers);

    const atomicCounter = new AtomicCounter();

    const output: Record<string, any>[] = [];

    let csvSourceStream = csvUrl
      ? responseToReadable(await fetch(csvUrl))
      : fileStream!;

    const {
      entitiesToCreate,
      categoriesAvailable,
      shelterSupliesByCategory,
      suppliesAvailable,
    } = await this.preProcessPipeline(
      csvSourceStream,
      efffectiveColumnNames,
      atomicCounter,
      useIAToPredictSupplyCategories,
    );

    // const transactionArgs: ReturnType<ShelterCsvImporter['wrapCreateShelter']>[] = []
    const transactionArgs: Prisma.ShelterCreateArgs[] = [];

    await Readable.toWeb(Readable.from(entitiesToCreate))
      .pipeThrough(
        new ShelterEnhancedStreamTransformer({
          categoriesAvailable,
          shelterSupliesByCategory,
          suppliesAvailable,
          counter: atomicCounter,
        }),
      )
      .pipeThrough(
        new TransformStream({
          // transform(chunk,controller){
          // }
        }),
      )
      .pipeTo(
        new WritableStream({
          write: async (
            shelter: ReturnType<(typeof CreateShelterSchema)['parse']>,
          ) => {
            if (dryRun) {
              onEntity?.(shelter);
              atomicCounter.incrementSuccess();
              return;
            }

            if (useBatchTransaction) {
              transactionArgs.push(this.getShelterCreateArgs(shelter));
              return;
            }

            await this.prismaService.shelter
              .create(this.getShelterCreateArgs(shelter))
              .then((d) => {
                atomicCounter.incrementSuccess();
                onEntity?.(d);
                output.push(d);
              })
              .catch((e: Error) => {
                atomicCounter.incrementFailure();
                if (e instanceof PrismaClientKnownRequestError) {
                  this.logger.error(translatePrismaError(e));
                } else {
                  this.logger.error(e);
                }
              });
          },
          close: async () => {
            if (useBatchTransaction && !dryRun) {
              try {
                const transactionResult = await this.prismaService.$transaction(
                  transactionArgs.map(this.prismaService.shelter.create),
                );
                output.push(...transactionResult);
                atomicCounter.incrementSuccess(transactionResult.length);
                atomicCounter.incrementFailure(
                  transactionResult.length - transactionArgs.length,
                );
              } catch (err) {
                this.logger.error('Erro ao executar transaction', err);
              }
            }
            this.logger.log(
              `${atomicCounter.successCount} de ${atomicCounter.totalCount} entidades processadas com sucesso. ${atomicCounter.failureCount} com erro.`,
            );
          },
        }),
      );

    return {
      successCount: atomicCounter.successCount,
      totalCount: atomicCounter.totalCount,
      failureCount: atomicCounter.failureCount,
      data: output,
    };
  }

  private getEffectiveColumnNames(headers: Partial<ShelterColumHeader>) {
    const efffectiveColumnNames = {} as ShelterColumHeader;
    Object.entries(CSV_DEFAULT_HEADERS).forEach(([key, value]) => {
      efffectiveColumnNames[key] =
        typeof headers[key] === 'string' ? headers[key] : value;
    });
    return efffectiveColumnNames;
  }

  private validateInput(csvUrl?: string, fileStream?: Readable) {
    const validInput = (csvUrl && URL.canParse(csvUrl)) || fileStream != null;

    if (!validInput) {
      this.logger.warn('Um dos campos `csvUrl` ou `fileStream` é obrigatório');
      throw new Error('Um dos campos `csvUrl` ou `fileStream` é obrigatório');
    }
  }

  private async preProcessPipeline(
    csvSourceStream: Readable,
    headers: ShelterColumHeader,
    atomicCounter: AtomicCounter,
    useIAToPredictSupplyCategories: boolean,
  ) {
    const [categories, supplies] = await this.prismaService.$transaction([
      this.prismaService.supplyCategory.findMany({}),
      this.prismaService.supply.findMany({ distinct: ['name'] }),
    ]);

    const entitiesToCreate: ShelterInput[] = [];
    const missingShelterSupplies = new Set<string>();

    const suppliesAvailable = supplies.reduce((acc, item) => {
      acc.set(item.name.trim().toLowerCase(), item.id);
      return acc;
    }, new Map<string, string>());

    const categoriesAvailable = categories.reduce((acc, item) => {
      acc.set(item.name.trim().toLowerCase(), item.id);
      return acc;
    }, new Map<string, string>());

    let shelterSupliesByCategory: Record<string, string[]> = {};
    await Readable.toWeb(csvSourceStream)
      .pipeThrough(Transform.toWeb(createCsvParser()))
      .pipeThrough(new CsvToShelterTransformStream(headers))
      .pipeThrough(
        new TransformStream({
          transform(shelter, controller) {
            atomicCounter.increment();
            if (shelter?.supplies?.length) {
              for (const supply of shelter.supplies) {
                if (suppliesAvailable.has(supply)) {
                  continue;
                }
                if (!missingShelterSupplies.has(supply)) {
                  missingShelterSupplies.add(supply);
                }
              }
            }
            entitiesToCreate.push(shelter);
            controller.enqueue(shelter);
          },
        }),
      )
      .pipeTo(
        new WritableStream({
          async close() {
            if (!useIAToPredictSupplyCategories) {
              return;
            }
            const missingSheltersString = Array.from(
              missingShelterSupplies,
            ).join(', ');
            shelterSupliesByCategory = await detectSupplyCategoryUsingAI(
              missingSheltersString,
              Array.from(categoriesAvailable.keys()),
            );
          },
        }),
      );
    return {
      entitiesToCreate,
      categoriesAvailable,
      shelterSupliesByCategory,
      suppliesAvailable,
    };
  }

  private getShelterCreateArgs(
    shelter: ReturnType<(typeof CreateShelterSchema)['parse']>,
  ): Prisma.ShelterCreateArgs {
    return {
      data: Object.assign(shelter, {
        createdAt: new Date().toISOString(),
      }),
      include: {
        shelterSupplies: {
          select: {
            supply: {
              select: {
                id: true,
                name: true,
                supplyCategory: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
    };
  }
}
