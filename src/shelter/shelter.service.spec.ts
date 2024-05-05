import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from './shelter.service';

describe('ShelterService', () => {
  let service: ShelterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterService],
    }).compile();

    service = module.get<ShelterService>(ShelterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
