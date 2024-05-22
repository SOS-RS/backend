import { Test, TestingModule } from '@nestjs/testing';
import { SuppliesHistoryController } from './supplies-history.controller';

describe('SuppliesHistoryController', () => {
  let controller: SuppliesHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuppliesHistoryController],
    }).compile();

    controller = module.get<SuppliesHistoryController>(SuppliesHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
