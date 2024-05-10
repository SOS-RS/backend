import { Test, TestingModule } from '@nestjs/testing';
import { SupplyCategoriesController } from './supply-categories.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SupplyCategoriesService } from './supply-categories.service';

describe('SupplyCategoriesController', () => {
  let controller: SupplyCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SupplyCategoriesService],
      controllers: [SupplyCategoriesController],
    }).compile();

    controller = module.get<SupplyCategoriesController>(SupplyCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
