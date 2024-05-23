import { Test, TestingModule } from '@nestjs/testing';

import { SuppliesHistoryController } from './supplies-history.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SuppliesHistoryService } from './supplies-history.service';

describe('SuppliesHistoryController', () => {
  let controller: SuppliesHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliesHistoryService],
      controllers: [SuppliesHistoryController],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    controller = module.get<SuppliesHistoryController>(
      SuppliesHistoryController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
