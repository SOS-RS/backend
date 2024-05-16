import { Test, TestingModule } from '@nestjs/testing';

import { PartnersService } from './partners.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PartnersService', () => {
  let service: PartnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnersService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            supplyCategory: { findMany: jest.fn().mockResolvedValue(0) },
          };
        }
      })
      .compile();

    service = module.get<PartnersService>(PartnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
