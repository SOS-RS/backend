import { Test, TestingModule } from '@nestjs/testing';
import { ShelterManagersController } from './shelter-managers.controller';

describe('ShelterManagersController', () => {
  let controller: ShelterManagersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelterManagersController],
    }).compile();

    controller = module.get<ShelterManagersController>(
      ShelterManagersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
