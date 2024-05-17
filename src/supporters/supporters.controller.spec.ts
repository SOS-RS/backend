import { Test, TestingModule } from '@nestjs/testing';

import { SupportersController } from './supporters.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SupportersService } from './supporters.service';

describe('SupportersController', () => {
  let controller: SupportersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupportersController],
      providers: [SupportersService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            supplyCategory: { findMany: jest.fn().mockResolvedValue(0) },
          };
        }
      })
      .compile();

    controller = module.get<SupportersController>(SupportersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
