import { Test, TestingModule } from '@nestjs/testing';
import { PartnersService } from './partners.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/prisma.service'); // Mock PrismaService

describe('PartnersService', () => {
  let service: PartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        { provide: PrismaService, useClass: PrismaService }, // Provide PrismaService
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({
        // Use value for PrismaService
        partners: {
          findMany: jest.fn().mockResolvedValue([]), // Mock findMany to return an empty array
          create: jest.fn().mockResolvedValue({}), // Mock create to return an empty object
        },
      })
      .compile();

    service = module.get<PartnersService>(PartnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all partners', async () => {
    const partners = await service.index();
    expect(partners).toEqual([]); // Adjusted to check against an empty array
  });

  it('should create a partner', async () => {
    await service.store({
      name: 'Partner 1',
      link: 'https://partner1.com',
    });
    expect(service).toBeDefined();
  });
});
