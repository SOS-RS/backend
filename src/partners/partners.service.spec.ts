import { Test, TestingModule } from '@nestjs/testing';
import { PartnersService } from './partners.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/prisma.service');

describe('PartnersService', () => {
  let service: PartnersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PartnersService,
        { provide: PrismaService, useClass: PrismaService },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({
        partners: {
          findMany: jest.fn().mockResolvedValue([]),
          create: jest.fn().mockResolvedValue({}),
        },
      })
      .compile();

    service = module.get<PartnersService>(PartnersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  it('should return all partners', async () => {
    const partners = await service.index();
    expect(partners).toEqual([]);
  });

  it('should create a partner', async () => {
    await service.store({
      name: 'Partner 1',
      link: 'https://partner1.com',
    });

    expect(prismaService.partners.create).toHaveBeenCalledWith({
      data: {
        name: 'Partner 1',
        link: 'https://partner1.com',
        createdAt: new Date().toISOString(),
      },
    });
  });
});
