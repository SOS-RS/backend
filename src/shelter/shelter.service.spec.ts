import { Test, TestingModule } from '@nestjs/testing';
import { ShelterService } from './shelter.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterCategory } from '@prisma/client';

describe('ShelterService', () => {
  let service: ShelterService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterService, PrismaService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            supplyCategory: {
              findMany: jest.fn().mockResolvedValue([]),
            },
            shelter: {
              findFirst: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
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

  describe('ShelterService - show method', () => {
    it('should return data with contact hidden when authorizedContact is false and shouldShowContact is false', async () => {
      const mockShelterData = {
        id: '1',
        name: 'Test Shelter',
        pix: '12345678901234567890',
        address: 'Test Address',
        street: 'Test Street',
        neighbourhood: 'Test Neighbourhood',
        city: 'Test City',
        streetNumber: '123',
        zipCode: '12345-678',
        petFriendly: true,
        shelteredPeople: 50,
        authorizedContact: false,
        capacity: 100,
        contact: '123456789',
        prioritySum: 5,
        latitude: -23.55052,
        longitude: -46.633308,
        verified: true,
        category: ShelterCategory.Shelter,
        actived: true,
        createdAt: '2024-08-12T12:00:00Z',
        updatedAt: '2024-08-13T12:00:00Z',
        shelterManagers: [],
        shelterSupplies: [],
        supplyHistories: [],
        donationOrders: [],
        shelterUsers: [],
      };

      jest
        .spyOn(prismaService.shelter, 'findFirst')
        .mockResolvedValueOnce(mockShelterData);

      const result = await service.show('1', false);
      expect(result).not.toBeNull();
      expect(result!.contact).toBe('Não autorizado informar');
    });

    it('should return data with contact visible when authorizedContact is true or shouldShowContact is true', async () => {
      const mockShelterData = {
        id: '1',
        name: 'Test Shelter',
        pix: '12345678901234567890',
        address: 'Test Address',
        street: 'Test Street',
        neighbourhood: 'Test Neighbourhood',
        city: 'Test City',
        streetNumber: '123',
        zipCode: '12345-678',
        petFriendly: true,
        shelteredPeople: 50,
        authorizedContact: true,
        capacity: 100,
        contact: '123456789',
        prioritySum: 5,
        latitude: -23.55052,
        longitude: -46.633308,
        verified: true,
        category: ShelterCategory.Shelter,
        actived: true,
        createdAt: '2024-08-12T12:00:00Z',
        updatedAt: '2024-08-13T12:00:00Z',
        shelterManagers: [],
        shelterSupplies: [],
        supplyHistories: [],
        donationOrders: [],
        shelterUsers: [],
      };

      jest
        .spyOn(prismaService.shelter, 'findFirst')
        .mockResolvedValueOnce(mockShelterData);

      const result = await service.show('1', true);
      expect(result).not.toBeNull();
      expect(result!.contact).toBe('123456789');
    });

    it('should return data with contact visible when shouldShowContact is true and authorizedContact is false', async () => {
      const mockShelterData = {
        id: '1',
        name: 'Test Shelter',
        pix: '12345678901234567890',
        address: 'Test Address',
        street: 'Test Street',
        neighbourhood: 'Test Neighbourhood',
        city: 'Test City',
        streetNumber: '123',
        zipCode: '12345-678',
        petFriendly: true,
        shelteredPeople: 50,
        authorizedContact: false,
        capacity: 100,
        contact: '123456789',
        prioritySum: 5,
        latitude: -23.55052,
        longitude: -46.633308,
        verified: true,
        category: ShelterCategory.Shelter,
        actived: true,
        createdAt: '2024-08-12T12:00:00Z',
        updatedAt: '2024-08-13T12:00:00Z',
        shelterManagers: [],
        shelterSupplies: [],
        supplyHistories: [],
        donationOrders: [],
        shelterUsers: [],
      };

      jest
        .spyOn(prismaService.shelter, 'findFirst')
        .mockResolvedValueOnce(mockShelterData);

      const result = await service.show('1', true);
      expect(result).not.toBeNull();
      expect(result!.contact).toBe('123456789');
    });
  });

  describe('ShelterService - index method', () => {
    it('should return shelters with contacts hidden when authorizedContact is false', async () => {
      const mockShelterData = [
        {
          id: '1',
          name: 'Test Shelter',
          pix: '12345678901234567890',
          address: 'Test Address',
          street: 'Test Street',
          neighbourhood: 'Test Neighbourhood',
          city: 'Test City',
          streetNumber: '123',
          zipCode: '12345-678',
          petFriendly: true,
          shelteredPeople: 50,
          authorizedContact: false,
          capacity: 100,
          contact: '123456789',
          prioritySum: 5,
          latitude: -23.55052,
          longitude: -46.633308,
          verified: true,
          category: ShelterCategory.Shelter,
          actived: true,
          createdAt: '2024-08-12T12:00:00Z',
          updatedAt: '2024-08-13T12:00:00Z',
          shelterManagers: [],
          shelterSupplies: [],
          supplyHistories: [],
          donationOrders: [],
          shelterUsers: [],
        },
      ];

      jest
        .spyOn(prismaService.shelter, 'findMany')
        .mockResolvedValueOnce(mockShelterData);
      jest.spyOn(prismaService.shelter, 'count').mockResolvedValueOnce(1);

      const query = {
        order: 'asc',
        orderBy: 'name',
        page: 1,
        perPage: 10,
        search: '',
      };

      const result = await service.index(query);

      result.results.forEach((shelter) => {
        expect(shelter.contact).toBe('Não autorizado informar');
      });
    });

    it('should return shelters with contacts visible when authorizedContact is true', async () => {
      const mockShelterData = [
        {
          id: '1',
          name: 'Test Shelter',
          pix: '12345678901234567890',
          address: 'Test Address',
          street: 'Test Street',
          neighbourhood: 'Test Neighbourhood',
          city: 'Test City',
          streetNumber: '123',
          zipCode: '12345-678',
          petFriendly: true,
          shelteredPeople: 50,
          authorizedContact: true,
          capacity: 100,
          contact: '123456789',
          prioritySum: 5,
          latitude: -23.55052,
          longitude: -46.633308,
          verified: true,
          category: ShelterCategory.Shelter,
          actived: true,
          createdAt: '2024-08-12T12:00:00Z',
          updatedAt: '2024-08-13T12:00:00Z',
          shelterManagers: [],
          shelterSupplies: [],
          supplyHistories: [],
          donationOrders: [],
          shelterUsers: [],
        },
      ];

      jest
        .spyOn(prismaService.shelter, 'findMany')
        .mockResolvedValueOnce(mockShelterData);
      jest.spyOn(prismaService.shelter, 'count').mockResolvedValueOnce(1);

      const query = {
        order: 'asc',
        orderBy: 'name',
        page: 1,
        perPage: 10,
        search: '',
      };

      const result = await service.index(query);

      result.results.forEach((shelter) => {
        expect(shelter.contact).toBe('123456789');
      });
    });

    it('should return an empty list when no shelters match the query', async () => {
      jest.spyOn(prismaService.shelter, 'findMany').mockResolvedValueOnce([]);
      jest.spyOn(prismaService.shelter, 'count').mockResolvedValueOnce(0);

      const query = {
        order: 'asc',
        orderBy: 'name',
        page: 1,
        perPage: 10,
        search: '',
      };

      const result = await service.index(query);

      expect(result.results).toEqual([]);
      expect(result.count).toBe(0);
    });
  });
});
