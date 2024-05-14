import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from './shelter.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ShelterService', () => {
  let service: ShelterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            supplyCategory: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          };
        }
      })
      .compile();

    service = module.get<ShelterService>(ShelterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
