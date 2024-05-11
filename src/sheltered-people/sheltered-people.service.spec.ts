import { Test, TestingModule } from '@nestjs/testing';
import { ShelteredPeopleService } from './sheltered-people.service';

describe('ShelteredPeopleService', () => {
  let service: ShelteredPeopleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelteredPeopleService],
    }).compile();

    service = module.get<ShelteredPeopleService>(ShelteredPeopleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
