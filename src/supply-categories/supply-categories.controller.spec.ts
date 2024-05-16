import { Test, TestingModule } from '@nestjs/testing';
import { SupplyCategoriesController } from './supply-categories.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupplyCategoriesService } from './supply-categories.service';

describe('SupplyCategoriesController', () => {
  let controller: SupplyCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyCategoriesController],
      providers: [SupplyCategoriesService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    controller = module.get<SupplyCategoriesController>(
      SupplyCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
