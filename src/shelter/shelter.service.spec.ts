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
            $queryRaw: jest.fn().mockReturnValue([]),
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

  describe('unaccentString', () => {
    it('should normalize strings with no accents or special characters', () => {
      const result = service.unaccentString('string normal');
      expect(result).toBe('string normal');
    });

    it('should normalize strings with special characters', () => {
      const result = service.unaccentString('Muçum');
      expect(result).toBe('Mucum');
    });

    it('should normalize strings with accents', () => {
      const result = service.unaccentString('Guaporé');
      expect(result).toBe('Guapore');
    });

    it('should normalize strings with both accents and special characters', () => {
      const result = service.unaccentString('Muçúm');
      expect(result).toBe('Mucum');
    });
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
