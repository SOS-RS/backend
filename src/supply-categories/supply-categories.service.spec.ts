import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplyCategoriesService } from './supply-categories.service';

describe('SupplyCategoriesService', () => {
  let service: SupplyCategoriesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyCategoriesService, PrismaService],
    }).compile();

    service = module.get<SupplyCategoriesService>(SupplyCategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
    prisma.supplyCategory.findFirst = jest.fn(); // Adicione esta linha
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should check for duplicates', async () => {
    const body = {
      name: 'Test',
    };

    const mockSupply = {
      name: 'Test'
    } as any;

    jest.spyOn(prisma.supplyCategory, 'findFirst').mockResolvedValue(mockSupply);

    const result = await service.isDuplicate(body);
    expect(result).toBe(true);
  });
});
