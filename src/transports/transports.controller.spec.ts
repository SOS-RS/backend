import { Test, TestingModule } from '@nestjs/testing';
import { TransportsController } from './transports.controller';

describe('TransportsController', () => {
  let controller: TransportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransportsController],
    }).compile();

    controller = module.get<TransportsController>(TransportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
