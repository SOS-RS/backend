import { Test, TestingModule } from '@nestjs/testing';
import { PartnersController } from './partners.controller';
import { PartnersService } from './partners.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PartnersController', () => {
  let controller: PartnersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnersController],
      providers: [PartnersService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            supplyCategory: { findMany: jest.fn().mockResolvedValue(0) },
          };
        }
      })
      .compile();

    controller = module.get<PartnersController>(PartnersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
