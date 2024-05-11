import { Test, TestingModule } from '@nestjs/testing';
import { ShelteredPeopleController } from './sheltered-people.controller';

describe('ShelteredPeopleController', () => {
  let controller: ShelteredPeopleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelteredPeopleController],
    }).compile();

    controller = module.get<ShelteredPeopleController>(ShelteredPeopleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
