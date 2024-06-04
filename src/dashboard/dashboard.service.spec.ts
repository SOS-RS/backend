import { Test, TestingModule } from '@nestjs/testing';

import { DashboardService } from './dashboard.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('DashboardService', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [DashboardService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
