import { Test, TestingModule } from '@nestjs/testing';
import { SupplyCategoriesService } from './supply-categories.service';

describe('SupplyCategoriesService', () => {
  let service: SupplyCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyCategoriesService],
    }).compile();

    service = module.get<SupplyCategoriesService>(SupplyCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
