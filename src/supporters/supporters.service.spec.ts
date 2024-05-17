import { Test, TestingModule } from '@nestjs/testing';

import { SupportersService } from './supporters.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SupportersService', () => {
  let service: SupportersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupportersService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            supplyCategory: { findMany: jest.fn().mockResolvedValue(0) },
          };
        }
      })
      .compile();

    service = module.get<SupportersService>(SupportersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
