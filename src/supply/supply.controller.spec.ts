import { Test, TestingModule } from '@nestjs/testing';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('SupplyController', () => {
  let controller: SupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyController],
      providers: [SupplyService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    controller = module.get<SupplyController>(SupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
