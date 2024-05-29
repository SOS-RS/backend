import { Test, TestingModule } from '@nestjs/testing';
import { TransportManagersController } from './transport-managers.controller';

describe('TransportManagersController', () => {
  let controller: TransportManagersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportManagersController],
    }).compile();

    controller = module.get<TransportManagersController>(TransportManagersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
