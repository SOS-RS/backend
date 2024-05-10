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
            $queryRaw: jest.fn() as jest.Mock,
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
      expect(result).toBe('Mucum');
    });

    it('should normalize strings with accents', () => {
      const result = service.normalizeString('Guaporé');
      expect(result).toBe('Guapore');
    });

    it('should normalize strings with both accents and special characters', () => {
      const result = service.normalizeString('Muçúm');
      expect(result).toBe('Mucum');
    });
  });

  describe('getUnaccentShelterIds', () => {
    it('should call $queryRaw with the correctly mounted query', async () => {
      const searchText = 'Muçum';
      await service.getUnaccentShelterIds(searchText);
      expect(prismaService.$queryRaw).toHaveBeenCalledWith({
        strings: [
          'SELECT id FROM shelters WHERE unaccent(name) ILIKE ',
          ' OR unaccent(address) ILIKE ',
          ';',
        ],
        values: ['%Mucum%', '%Mucum%'],
      });
    });

    it('should return an empty array if an error occurs', async () => {
      const searchText = 'Muçum';
      const spy = jest
        .spyOn(prismaService, '$queryRaw')
        .mockImplementation(() => {
          throw new Error('Database error');
        });

      const result = await service.getUnaccentShelterIds(searchText);
      expect(result).toEqual([]);
      expect(spy).toHaveBeenCalledWith({
        strings: [
          'SELECT id FROM shelters WHERE unaccent(name) ILIKE ',
          ' OR unaccent(address) ILIKE ',
          ';',
        ],
        values: ['%Mucum%', '%Mucum%'],
      });

      spy.mockRestore();
    });
  });
});
