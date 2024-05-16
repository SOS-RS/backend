import { Injectable, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Readable, Transform } from 'node:stream';
import { TransformStream } from 'node:stream/web';

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
import { ParseCsvArgs, ShelterColumHeader, ShelterInput } from './types';

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
  async shelterToCsv({
    headers,
    csvUrl,
    fileStream,
  }: ParseCsvArgs<ShelterColumHeader>) {
    const validInput = (csvUrl && URL.canParse(csvUrl)) || fileStream != null;

    if (!validInput) {
      this.logger.warn('Um dos campos `csvUrl` ou `fileStream` é obrigatório');
      throw new Error('Um dos campos `csvUrl` ou `fileStream` é obrigatório');
    }
    const atomicCounter = new AtomicCounter();
    const shelters: ShelterInput[] = [];

    let csvSourceStream: Readable;
    if (csvUrl) {
      csvSourceStream = responseToReadable(await fetch(csvUrl));
    } else {
      csvSourceStream = fileStream!;
    }

    const [categories, supplies] = await this.prismaService.$transaction([
      this.prismaService.supplyCategory.findMany({}),
      this.prismaService.supply.findMany({ distinct: ['name'] }),
    ]);

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
            shelters.push(shelter);
            controller.enqueue(shelter);
          },
        }),
      )
      .pipeTo(
        new WritableStream({
          async close() {
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

    await Readable.toWeb(Readable.from(shelters))
      .pipeThrough(
        new ShelterEnhancedStreamTransformer({
          categoriesAvailable,
          shelterSupliesByCategory,
          suppliesAvailable,
          counter: atomicCounter,
        }),
      )
      .pipeTo(
        new WritableStream({
          write: async (
            shelter: ReturnType<(typeof CreateShelterSchema)['parse']>,
          ) => {
            await this.prismaService.shelter
              .create({ data: shelter, select: { name: true, id: true } })
              .then((d) => {
                atomicCounter.incrementSuccess();
                this.logger.debug?.(d);
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
          close: () => {
            this.logger.log(
              `${atomicCounter.successCount} de ${atomicCounter.totalCount} processados. ${atomicCounter.failureCount} com erro.`,
            );
          },
        }),
      );

    return {
      successCount: atomicCounter.successCount,
      totalCount: atomicCounter.totalCount,
      failureCount: atomicCounter.failureCount,
    };
  }
}
