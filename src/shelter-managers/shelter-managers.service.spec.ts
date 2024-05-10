import { Test, TestingModule } from '@nestjs/testing';
import { ShelterManagersService } from './shelter-managers.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShelterManagersController } from './shelter-managers.controller';

describe('ShelterManagersService', () => {
  let service: ShelterManagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShelterManagersService],
      controllers: [ShelterManagersController],
    }).compile();

    service = module.get<ShelterManagersService>(ShelterManagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
