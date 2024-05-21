import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterSupplyLogsService } from './shelter-supply-log.service';

describe('ShelterSupplyLogsService', () => {
  let service: ShelterSupplyLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterSupplyLogsService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    service = module.get<ShelterSupplyLogsService>(ShelterSupplyLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
