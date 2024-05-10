import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from './shelter.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ShelterService', () => {
  let service: ShelterService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShelterService,
        {
          provide: PrismaService,
          useValue: {
            $queryRawUnsafe: jest.fn() as jest.Mock,
          },
        },
      ],
    }).compile();

    service = module.get<ShelterService>(ShelterService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('normalizeString', () => {
    it('should normalize strings with no accents or special characters', () => {
      const result = service.normalizeString('string normal');
      expect(result).toBe('string normal');
    });

    it('should normalize strings with special characters', () => {
      const result = service.normalizeString('Muçum');
      expect(result).toBe('mucum');
    });

    it('should normalize strings with accents', () => {
      const result = service.normalizeString('Guaporé');
      expect(result).toBe('guapore');
    });

    it('should normalize strings with both accents and special characters', () => {
      const result = service.normalizeString('Muçúm');
      expect(result).toBe('mucum');
    });
  });

  describe('getUnaccentShelterIds', () => {
    it('should call $queryRawUnsafe with the correctly mounted query', async () => {
      const searchText = 'Muçum';
      const expectedQuery =
        "SELECT id FROM shelters WHERE unaccent(lower(name)) LIKE '%mucum%' OR unaccent(lower(address)) LIKE '%mucum%';";
      await service.getUnaccentShelterIds(searchText);
      expect(prismaService.$queryRawUnsafe).toHaveBeenCalledWith(expectedQuery);
    });

    it('should return an empty array if an error occurs', async () => {
      const searchText = 'Muçum';
      const spy = jest
        .spyOn(prismaService, '$queryRawUnsafe')
        .mockImplementation(() => {
          throw new Error('Database error');
        });

      const result = await service.getUnaccentShelterIds(searchText);
      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalledWith(
        "SELECT id FROM shelters WHERE unaccent(lower(name)) LIKE '%mucum%' OR unaccent(lower(address)) LIKE '%mucum%';",
      );

      spy.mockRestore();
    });
  });
});
