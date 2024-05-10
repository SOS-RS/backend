import { Test, TestingModule } from '@nestjs/testing';
import { SupplyCategoriesController } from './supply-categories.controller';

describe('SupplyCategoriesController', () => {
  let controller: SupplyCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyCategoriesController],
    }).compile();

    controller = module.get<SupplyCategoriesController>(
      SupplyCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
