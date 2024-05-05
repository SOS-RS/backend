import { Test, TestingModule } from '@nestjs/testing';
import { SupplyService } from './supply.service';

describe('SupplyService', () => {
  let service: SupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyService],
    }).compile();

    service = module.get<SupplyService>(SupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
