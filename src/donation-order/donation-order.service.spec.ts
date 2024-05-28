import { Test, TestingModule } from '@nestjs/testing';

import { DonationOrderService } from './donation-order.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('DonationOrderService', () => {
  let service: DonationOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [DonationOrderService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    service = module.get<DonationOrderService>(DonationOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
