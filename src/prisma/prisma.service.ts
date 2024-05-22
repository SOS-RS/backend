import { SessionData } from '@/decorators/audit.decorator';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient, ShelterSupply } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PrismaService
  extends PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error' | 'beforeExit'
  >
  implements OnModuleInit
{
  constructor() {
    super({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'stdout',
          level: 'info',
        },
        {
          emit: 'stdout',
          level: 'warn',
        },
      ],
    });
    // Mergea o Proxy criado pelo Prisma
    // Alternativa usar o VALUE no provider.
    Object.assign(this, ExtendPrismaClient(this));
  }
  async onModuleInit() {
    await this.$connect();
    this.$use(async (params, next) => {
      if (
        (params.action === 'create' || params.action === 'update') &&
        params.model === 'User' &&
        !!params.args.data.password
      ) {
        const user = params.args.data;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        params.args.data = user;
      }
      return next(params);
    });
  }
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}

export type AuditableProps<T = any> = {
  auditProps?: T extends any
    ? string[]
    : (keyof Prisma.Args<T, 'update'>['data'])[];

  auditor: {
    ip: string;
    userId: string;
  };
};

/**
 * Customização do cliente para permitir customizar alguns métodos
 * @see https://www.prisma.io/docs/orm/prisma-client/client-extensions/
 */
function ExtendPrismaClient(client: PrismaClient) {
  return client
    .$extends({
      result: {
        shelterSupply: {
          equals: {
            needs: { shelterId: true, supplyId: true },
            compute({ shelterId, supplyId }) {
              return (other: ShelterSupply) => {
                return (
                  shelterId.toLowerCase() === other.shelterId.toLowerCase() &&
                  supplyId.toLowerCase() === other.supplyId.toLowerCase()
                );
              };
            },
          },
        },
      },
      model: {
        $allModels: {
          async updateAndAudit<T>(
            this: Omit<T, 'ShelterSupplies'>,
            args: Prisma.Args<T, 'update'> & AuditableProps,
          ): Promise<Prisma.Result<T, T, 'update'>> {
            const context = Prisma.getExtensionContext(this) as any;

            // const dm = context.$parent._runtimeDataModel[context.$name]

            if (!args.auditProps) {
              delete args.auditProps;
              delete args.auditor;
              return context.update(args);
            }

            const modelBefore = await context.findUnique({ where: args.where });

            if (!modelBefore) {
              return modelBefore;
            }
            const argProps = [...args.auditProps];
            const auditor = Object.assign(args.auditor, {});
            delete args.auditProps;
            delete args.auditor;

            const modelAfter = await context.update(args);
            const before: Record<string, any> = {};
            const after: Record<string, any> = {};

            for (const prop of argProps) {
              before[prop] = modelBefore[prop];
              after[prop] = modelAfter[prop];
            }

            const hasChanges = argProps.some(
              (key) => before[key] !== after[key],
            );

            if (!hasChanges) {
              return modelAfter;
            }

            const modelId = args.where.id ?? JSON.stringify(args.where);
            await client.audit.create({
              data: {
                userId: auditor.id,
                ip: auditor.ip,
                modelId,
                currentValue: after,
                previousValue: before,
                modelName: context.$name,
              },
            });

            return modelAfter;
          },
        },
      },
    })
    .$extends({
      model: {
        shelterSupply: {
          async updateAndAudit(
            args: Prisma.ShelterSupplyUpdateArgs & SessionData,
          ) {
            const { data, where, ipAddress, userId } = args;
            const auditArgs = Object.assign({ ipAddress, userId }, {});
            delete args.ipAddress;
            delete args.userId;
            const beforeUpdate = await client.shelterSupply.findUnique({
              where,
              include: {
                shelter: { select: { name: true } },
                supply: { select: { name: true } },
              },
            });

            if (
              beforeUpdate?.quantity === data.quantity &&
              beforeUpdate?.priority === data.priority
            ) {
              return client.shelterSupply.update(
                args as Prisma.ShelterSupplyUpdateArgs,
              );
            }
            const afterUpdate = await client.shelterSupply.update(
              args as Prisma.ShelterSupplyUpdateArgs,
            );
            await client.shelterSupplyLogs.create({
              data: {
                ...auditArgs,
                currentPriority: afterUpdate.priority,
                previousPriority: beforeUpdate?.priority,
                currentQuantity: afterUpdate.quantity,
                previousQuantity: beforeUpdate?.quantity,
                shelterName: beforeUpdate?.shelter.name,
                supplyName: beforeUpdate?.supply.name,
              },
            });

            return afterUpdate;
          },
          async updateAndAuditMany(
            args: Prisma.ShelterSupplyUpdateManyArgs & SessionData,
          ) {
            const { where } = args;
            const { ipAddress, userId } = Object.assign(
              { ipAddress: args.ipAddress, userId: args.userId },
              {},
            );

            delete args.ipAddress;
            delete args.userId;

            const shelterSupplyFindManyArgs: Prisma.ShelterSupplyFindManyArgs =
              {
                where,
                orderBy: { createdAt: 'asc' },
                include: {
                  shelter: { select: { name: true } },
                  supply: { select: { name: true } },
                },
              };

            const shelterSuppliesBefore = await (<ExtendedPrismaService>(
              client
            )).shelterSupply.findMany(shelterSupplyFindManyArgs);

            if (shelterSuppliesBefore.length === 0) {
              return { count: 0 } as Prisma.BatchPayload;
            }

            await (<ExtendedPrismaService>client).shelterSupply.updateMany(
              args as Prisma.ShelterSupplyUpdateManyArgs,
            );

            const shelterSuppliesAfter = (await (<ExtendedPrismaService>(
              client
            )).shelterSupply.findMany(
              shelterSupplyFindManyArgs,
            )) as ((typeof shelterSuppliesBefore)[number] & {
              shelter: { name: string };
              supply: { name: string };
            })[];

            const diffs: Prisma.ShelterSupplyLogsCreateInput[] = [];

            shelterSuppliesBefore.forEach((previous, index) => {
              const current = shelterSuppliesAfter[index];
              if (previous.equals(current)) {
                diffs.push({
                  userId,
                  ipAddress,
                  currentPriority: current.priority,
                  previousPriority: previous?.priority,
                  currentQuantity: current.quantity,
                  previousQuantity: previous?.quantity,
                  shelterName: current.shelter.name,
                  supplyName: current.supply.name,
                });
              }
            });

            if (diffs.length > 0) {
              await client.shelterSupplyLogs.createMany({ data: diffs });
            }

            return shelterSuppliesAfter;
          },
        },
      },
    });
}

type CustomPrismaClient = ReturnType<typeof ExtendPrismaClient>;

export type ExtendedPrismaService = ReturnType<
  typeof Object.assign<CustomPrismaClient, PrismaService>
>;
