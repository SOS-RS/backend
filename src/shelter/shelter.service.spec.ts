import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from './shelter.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ShelterService', () => {
  let service: ShelterService;
  let prismaService: PrismaService;

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
            $queryRaw: jest.fn().mockReturnValue([]),
          };
        }
      })
      .compile();

    service = module.get<ShelterService>(ShelterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUnaccentShelterIds', () => {
    it('should call $queryRaw with the correctly mounted query', async () => {
      const searchText = 'Muçum';
      await service['getUnaccentShelterIds'](searchText);
      expect(prismaService.$queryRaw).toHaveBeenCalledWith({
        strings: [
          'SELECT id FROM shelters WHERE unaccent(name) ILIKE ',
          ' OR unaccent(address) ILIKE ',
          ';',
        ],
        values: ['%Mucum%', '%Mucum%'],
      });
    });
  });
});
