import { Test, TestingModule } from '@nestjs/testing';
import { ShelterSupplyService } from './shelter-supply.service';

describe('ShelterSupplyService', () => {
  let service: ShelterSupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterSupplyService],
    }).compile();

    service = module.get<ShelterSupplyService>(ShelterSupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
