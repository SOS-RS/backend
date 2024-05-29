import { Test, TestingModule } from '@nestjs/testing';
import { TransportsService } from './transports.service';

describe('TransportsService', () => {
  let service: TransportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransportsService],
    }).compile();

    service = module.get<TransportsService>(TransportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
