import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransformStream } from 'node:stream/web';
import { CreateShelterSchema } from '../shelter/types/types';
import { AtomicCounter } from './shelter-csv-importer.helpers';
import {
  COLON_REGEX, EnhancedTransformArgs,
  ShelterColumHeader,
  ShelterInput
} from './types';

/**
 * JSON -> ShelterInput
 * @see ShelterInput
 */
export class CsvToShelterTransformStream extends TransformStream<
  unknown,
  ShelterInput
> {
  private readonly logger = new Logger(CsvToShelterTransformStream.name);
  /**
   * Espera um Ojeto contento a assinatura da entidade esperada
   * @param columnNames dicionário com nomes das colunas a serem mapeadas
   */
  constructor(columnNames: ShelterColumHeader) {

    super({
      transform: async (chunk, controller) => {
        if (!chunk || (chunk && typeof chunk !== 'object')) {
          this.logger.warn('Invalid chunk received', chunk);
          return;
        }
        let supplies: string[] = [];

        if (
          typeof chunk[columnNames.shelterSuppliesField] === 'string'
        ) {
          supplies = (<string>chunk[columnNames.shelterSuppliesField])
            .split(COLON_REGEX)
            .filter(Boolean)
            .map((s) => s.trim());
        }

        const shelter: ShelterInput = {
          verified: false,
          // Removendo duplicidades
          supplies: [...new Set(supplies)],
        };

        Object.keys(Prisma.ShelterScalarFieldEnum).forEach((key) => {
          shelter[key] ??= chunk[columnNames[`${key}Field`]];
        });

        controller.enqueue(shelter);
      }
    });
  }
}
/**
 * Valida o schema do Input, enriquece o modelo e adicionas as relações encontradas
 */
export class ShelterEnhancedStreamTransformer extends TransformStream<
  ShelterInput,
  ReturnType<typeof CreateShelterSchema.parse>
> {
  private counter!: AtomicCounter;
  private readonly logger = new Logger(CsvToShelterTransformStream.name);
  /**
   *
   */
  constructor({
    shelterSupliesByCategory,
    suppliesAvailable,
    categoriesAvailable,
    counter,
  }: EnhancedTransformArgs) {
    super({
      transform: async (shelter: ShelterInput, controller) => {
        this.counter ??= counter || new AtomicCounter();
        if (!shelter.supplies) {
          try {
            controller.enqueue(CreateShelterSchema.parse(shelter));
          } catch (error) {
            this.counter.incrementFailure();
            this.logger.error(error, shelter);
          }
          return;
        }

        const missingSupplyNames = new Set<string>();

        const toCreate: Prisma.ShelterSupplyCreateNestedManyWithoutShelterInput['create'] =
          [];

        for (const supplyName of missingSupplyNames.values()) {
          for (const [categoryName, values] of Object.entries(
            shelterSupliesByCategory,
          )) {
            const indexFound = values.findIndex(
              (item) => item.toLowerCase() === supplyName.toLowerCase(),
            );
            if (indexFound !== -1) {
              toCreate.push({
                supplyId: suppliesAvailable.get(supplyName.toLowerCase())!,
                createdAt: new Date().toISOString(),
                supply: {
                  connect: {
                    id: suppliesAvailable.get(supplyName.toLowerCase())!,
                    name: supplyName,
                  },
                  connectOrCreate: {
                    where: {
                      id: suppliesAvailable.get(supplyName.toLowerCase()),
                    },
                    create: {
                      name: supplyName,
                      createdAt: new Date().toISOString(),
                      supplyCategory: {
                        connect: {
                          name: categoryName,
                          id: categoriesAvailable.get(
                            categoryName.toLowerCase(),
                          ),
                        },
                      },
                    },
                  },
                },
              });
            }
          }
        }
        shelter.shelterSupplies = {
          create: toCreate,
        };

        if (shelter.latitude) {
          shelter.latitude = Number.parseFloat(`${shelter.latitude}`);
        }
        if (shelter.longitude) {
          shelter.longitude = Number.parseFloat(`${shelter.longitude}`);
        }

        Object.keys(shelter).forEach((key) => {
          if (
            typeof shelter[key] === 'string' &&
            shelter[key].trim().length === 0
          ) {
            shelter[key] = null;
          }
        });

        await CreateShelterSchema.parseAsync(shelter)
          .then((s) => controller.enqueue(s))
          .catch((e) => {
            this.counter.incrementFailure();
            this.logger.error(e.message, shelter);
          });
      },
    });
  }
}
