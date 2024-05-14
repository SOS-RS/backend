import { Test, TestingModule } from '@nestjs/testing';
import { ShelterManagersService } from './shelter-managers.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ShelterManagersService', () => {
  let service: ShelterManagersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterManagersService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    service = module.get<ShelterManagersService>(ShelterManagersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
