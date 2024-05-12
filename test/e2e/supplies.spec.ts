import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplyModule } from 'src/supply/supply.module';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

function generateFakeSupply() {
  return {
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    supplyCategory: {
      id: faker.string.uuid(),
      name: faker.commerce.productMaterial(),
    },
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  };
}

describe('Supplies (e2e)', () => {
  let app: INestApplication;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SupplyModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaService>())
      .compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);
    await app.init();
  });

  it('/supplies (GET)', () => {
    const length = faker.number.int(1000);
    const fakeSupplies = Array.from({ length }, generateFakeSupply);

    prisma.supply.findMany.mockResolvedValueOnce(fakeSupplies as any);

    return request(app.getHttpServer())
      .get('/supplies')
      .expect(200)
      .expect(function (response) {
        const data = response.body;
        expect(data).toEqual({
          message: 'Successfully get supplies',
          respData: fakeSupplies,
          statusCode: 200,
        });
      });
  });
});
