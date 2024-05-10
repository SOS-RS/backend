import { Test, TestingModule } from '@nestjs/testing';
import { SupplyCategoriesService } from './supply-categories.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupplyCategoriesController } from './supply-categories.controller';

describe('SupplyCategoriesService', () => {
  let service: SupplyCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SupplyCategoriesService],
      controllers: [SupplyCategoriesController],
    }).compile();

    service = module.get<SupplyCategoriesService>(SupplyCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
