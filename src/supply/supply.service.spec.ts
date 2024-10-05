import { Test, TestingModule } from '@nestjs/testing';
import { SupplyService } from './supply.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('SupplyService', () => {
  let service: SupplyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyService, PrismaService],
    }).compile();

    service = module.get<SupplyService>(SupplyService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check for duplicates', async () => {
    const body = {
      name: 'Test',
      supplyCategoryId: '1',
    };

    const mockSupply = {
      name: 'Test',
      supplyCategory: {
        id: '1',
      },
    } as any;
  
    jest.spyOn(prisma.supply, 'findFirst').mockResolvedValue(mockSupply);

    const result = await service.isDuplicate(body);
    expect(result).toBe(true);
  });

});
