import { SessionData } from '@/decorators/audit.decorator';
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient, ShelterSupply } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
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

  // auditLog: Prisma.Middleware<any> = async (params, next) => {
  //   const { action, args, dataPath, model, runInTransaction } = params;
  //   console.log(
  //     '🚀 ~ auditLog:Prisma.Middleware<any>= ~ {action,args,dataPath,model}:',
  //     { action, args, dataPath, model },
  //   );
  //   switch (action) {
  //     case 'delete':
  //     case 'update': {
  //       if (model && typeof args === 'object' && args.data) {
  //         // //@ts-expect-error
  //         // const modelBefore = await this[model.toLowerCase() as PrismaModel].findUnique({
  //         //   where: {
  //         //     id: args.data.id,
  //         //   },
  //         // });

  //         const modelBefore = await this.$queryRawUnsafe(
  //           `Select * from ${model} where id = ${args.data.id}`,
  //         );
  //         console.log('🚀 ~ modelBefore ~ modelBefore:', modelBefore);
  //         const modelAfter = await next(params);
  //         console.log(
  //           '🚀 ~ auditLog:Prisma.Middleware<any>= ~ modelAfter:',
  //           modelAfter,
  //         );
  //       }
  //       break;
  //     }
  //     default:
  //       return next(params);
  //   }
  // };
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

function ExtendPrismaClient(client: PrismaClient) {
  return client
    .$extends({
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
          async updateAndAudit(args: Prisma.ShelterSupplyUpdateArgs & SessionData) {
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
          async updateAndAuditMany(args: Prisma.ShelterSupplyUpdateManyArgs & SessionData) {
            const {  where, ipAddress, userId } = args;
            const auditArgs = Object.assign({ ipAddress, userId }, {});
            console.log("🚀 ~ updateAndAuditMany ~ auditArgs:", auditArgs)
            delete args.ipAddress;
            delete args.userId;

            // TODO: finish implementation
            // const beforeUpdate = await client.shelterSupply.findMany({
            //   where,
            //   include: {
            //     shelter: { select: { name: true } },
            //     supply: { select: { name: true } },
            //   },
            // });

       
            const afterUpdate = await client.shelterSupply.updateMany(
              args as Prisma.ShelterSupplyUpdateManyArgs 
            )
            console.log("🚀 ~ updateAndAuditMany ~ afterUpdate:", afterUpdate)


            // const diff = beforeUpdate.filter((ss,index) => {
              // return ss.priority !== afterUpdate[index],
            // })
            // console.log("🚀 ~ diff ~ beforeUpdate:", beforeUpdate)

            // await client.shelterSupplyLogs.create({
            //   data: {
            //     ...auditArgs,
            //     currentPriority: afterUpdate.priority,
            //     previousPriority: beforeUpdate?.priority,
            //     currentQuantity: afterUpdate.quantity,
            //     previousQuantity: beforeUpdate?.quantity,
            //     shelterName: beforeUpdate?.shelter.name,
            //     supplyName: beforeUpdate?.supply.name,
            //   },
            // });

            return afterUpdate;
          },
        },
      },
    });
}

export type ExtendedPrismaService = ReturnType<typeof ExtendPrismaClient>;
