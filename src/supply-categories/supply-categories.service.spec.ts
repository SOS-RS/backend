import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplyCategoriesService } from './supply-categories.service';

describe('SupplyCategoriesService', () => {
  let service: SupplyCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyCategoriesService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    service = module.get<SupplyCategoriesService>(SupplyCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
