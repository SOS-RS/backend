import { Test, TestingModule } from '@nestjs/testing';
import { SupplyService } from './supply.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupplyController } from './supply.controller';

describe('SupplyService', () => {
  let service: SupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SupplyService],
      controllers: [SupplyController],
    }).compile();

    service = module.get<SupplyService>(SupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
