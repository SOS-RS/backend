import { Test, TestingModule } from '@nestjs/testing';
import { SupplyController } from './supply.controller';

describe('SupplyController', () => {
  let controller: SupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyController],
    }).compile();

    controller = module.get<SupplyController>(SupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
