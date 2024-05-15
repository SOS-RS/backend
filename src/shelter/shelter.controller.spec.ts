import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterController } from './shelter.controller';
import { ShelterService } from './shelter.service';

describe('ShelterController', () => {
  let controller: ShelterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelterController],
      providers: [ShelterService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {
            supplyCategory: { findMany: jest.fn().mockResolvedValue(0) },
          };
        }
      })
      .compile();

    controller = module.get<ShelterController>(ShelterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
