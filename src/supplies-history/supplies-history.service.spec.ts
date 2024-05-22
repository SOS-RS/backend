import { Test, TestingModule } from '@nestjs/testing';
import { SuppliesHistoryService } from './supplies-history.service';

describe('SuppliesHistoryService', () => {
  let service: SuppliesHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuppliesHistoryService],
    }).compile();

    service = module.get<SuppliesHistoryService>(SuppliesHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
