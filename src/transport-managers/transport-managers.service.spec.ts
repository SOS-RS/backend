import { Test, TestingModule } from '@nestjs/testing';
import { TransportManagersService } from './transport-managers.service';

describe('TransportManagersService', () => {
  let service: TransportManagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportManagersService],
    }).compile();

    service = module.get<TransportManagersService>(TransportManagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
