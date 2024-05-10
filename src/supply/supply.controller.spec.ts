import { Test, TestingModule } from '@nestjs/testing';
import { SupplyController } from './supply.controller';
import { SupplyService } from './supply.service';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('SupplyController', () => {
  let controller: SupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SupplyService],
      controllers: [SupplyController],
    }).compile();

    controller = module.get<SupplyController>(SupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
