import { fakerPT_BR as faker } from '@faker-js/faker';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AccessLevel, Shelter, ShelterSupply } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TokenPayload } from 'src/sessions/types';
import { UpdateShelterSupplySchema } from 'src/shelter-supply/types';
import { SupplyPriority } from 'src/supply/types';
import * as request from 'supertest';
import { util, z } from 'zod';
import { getTestSessionData, randomEnumValue } from './test-utils';
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(404);
  });
});

describe('ShelterSupplyController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let shelter: Shelter;
  let prisma: PrismaService;
  let shelterSupplies: ShelterSupply[];
  let sessionData: TokenPayload;

  const isTestDatabase =
    new String(process.env.DB_DATABASE_NAME).toLowerCase().endsWith('test') ||
    process.env.NODE_ENV === 'test';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app = await app.init();
    prisma = app.get(PrismaService);
    if (!isTestDatabase) {
      throw new Error('Test database not configured');
    }

    ({ shelter, shelterSupplies } = await seedTestDatabase(prisma));
  });

  afterAll(async () => {
    await clearTestDatabase(prisma);
  });

  it('/shelter/supplies/{shelterId}/{supplyId} (PUT)', async () => {
    sessionData = await getTestSessionData(prisma, AccessLevel.User);
    jwtToken = app.get(JwtService).sign(sessionData);

    const supplyBefore = shelterSupplies[0];
    const nextPriority = randomEnumValue(SupplyPriority);

    const incrementedQuantity = (supplyBefore.quantity ?? 0) + 1;

    await request(app.getHttpServer())
      .put(`/shelter/supplies/${shelter.id}/${supplyBefore.supplyId}`)
      .auth(jwtToken, { type: 'bearer' })
      .send({
        priority: nextPriority,
        quantity: incrementedQuantity,
      } as z.infer<typeof UpdateShelterSupplySchema>['data'])
      .expect(200);

    const log = await prisma.suppliesHistory.findFirst({
      where: { userId: sessionData.userId },
      orderBy: { updatedAt: 'desc' },
    });

    expect(log).toMatchObject({
      previousPriority: supplyBefore.priority,
      previousQuantity: supplyBefore.quantity,
      // usando mesma lógica aplicada ao serviço
      currentQuantity:
        nextPriority !== SupplyPriority.UnderControl
          ? incrementedQuantity
          : null,
      currentPriority: nextPriority,
      shelterName: shelter.name,
      userId: sessionData.userId,
    });
    expect(log?.ipAddress).toBeTruthy();
    expect(log?.supplyName).toBeTruthy();
  });

  it('/shelter/supplies/{shelterId}/supplies/many (PUT)', async () => {
    sessionData = await getTestSessionData(
      prisma,
      AccessLevel.DistributionCenter,
    );
    jwtToken = app.get(JwtService).sign(sessionData);

    const before = await prisma.suppliesHistory.count();
    const supplyIds = shelterSupplies.map(({ supplyId }) => supplyId);

    await request(app.getHttpServer())
      .put(`/shelter/supplies/${shelter.id}/supplies/many`)
      .auth(jwtToken, { type: 'bearer' })
      .send({
        ids: supplyIds,
      })
      .expect(200);

    const after = await prisma.suppliesHistory.count();
    const suppliesHistory = await prisma.suppliesHistory.findMany({
      orderBy: { updatedAt: 'desc' },
      take: supplyIds.length,
    });

    expect(after).toEqual(before + shelterSupplies.length);
    suppliesHistory.forEach((sh) => {
      expect(sh.userId).toEqual(sessionData.userId);
    });
  });
});
async function seedTestDatabase(prisma: PrismaService) {
  const users = await prisma.$transaction(
    util.getValidEnumValues(AccessLevel).map((accessLevel) =>
      prisma.user.create({
        data: {
          name: faker.person.firstName(),
          phone: faker.phone.number(),
          password: faker.internet.password(),
          login: faker.phone.number(),
          lastName: faker.person.lastName(),
          createdAt: new Date().toISOString(),
          accessLevel,
        },
      }),
    ),
  );

  const supplyCategories = await prisma.$transaction(
    [
      ...new Set(
        Array.from({
          length: 10,
        }).map(() => faker.commerce.department()),
      ),
    ].map((name) =>
      prisma.supplyCategory.create({
        data: {
          name,
          createdAt: new Date().toISOString(),
        },
      }),
    ),
  );

  const supplies = await prisma.$transaction(
    supplyCategories.map((sc) =>
      prisma.supply.create({
        data: {
          supplyCategoryId: sc.id,
          name: faker.commerce.productName(),
          createdAt: new Date().toISOString(),
        },
      }),
    ),
  );

  const shelter = await prisma.shelter.create({
    data: {
      address: faker.location.streetAddress(),
      name: faker.company.name(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      zipCode: faker.location.zipCode('#####-###'),
      capacity: faker.number.int({ max: 1000 }),
      street: faker.location.street(),
      pix: faker.phone.number(),
      createdAt: new Date().toISOString(),
    },
  });

  const shelterSupplies = await prisma.$transaction(
    supplies.map((s) =>
      prisma.shelterSupply.create({
        data: {
          shelterId: shelter.id,
          supplyId: s.id,
          priority: randomEnumValue(SupplyPriority),
          quantity: faker.number.int({ max: 100 }),
          createdAt: new Date().toISOString(),
        },
      }),
    ),
  );
  return { shelter, supplyCategories, supplies, shelterSupplies, users };
}

async function clearTestDatabase(prisma: PrismaService) {
  return prisma.$transaction([
    prisma.shelterSupply.deleteMany(),
    prisma.supply.deleteMany(),
    prisma.suppliesHistory.deleteMany(),
    prisma.supplyCategory.deleteMany(),
    prisma.shelter.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}
