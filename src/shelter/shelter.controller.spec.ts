import { Test, TestingModule } from '@nestjs/testing';
import { ShelterController } from './shelter.controller';

describe('ShelterController', () => {
  let controller: ShelterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelterController],
    }).compile();

    controller = module.get<ShelterController>(ShelterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
