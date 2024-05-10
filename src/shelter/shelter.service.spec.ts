import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from './shelter.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShelterController } from './shelter.controller';

describe('ShelterService', () => {
  let service: ShelterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShelterService],
      controllers: [ShelterController],
    }).compile();

    service = module.get<ShelterService>(ShelterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
