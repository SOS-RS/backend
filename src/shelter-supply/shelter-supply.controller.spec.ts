import { Test, TestingModule } from '@nestjs/testing';
import { ShelterSupplyController } from './shelter-supply.controller';

describe('ShelterSupplyController', () => {
  let controller: ShelterSupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelterSupplyController],
    }).compile();

    controller = module.get<ShelterSupplyController>(ShelterSupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
