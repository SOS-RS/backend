import { Test, TestingModule } from '@nestjs/testing';

import { DonationOrderController } from './donation-order.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { DonationOrderService } from './donation-order.service';

describe('DonationOrderController', () => {
  let controller: DonationOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [DonationOrderService],
      controllers: [DonationOrderController],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    controller = module.get<DonationOrderController>(DonationOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
