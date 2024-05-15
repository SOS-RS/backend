import { Test, TestingModule } from '@nestjs/testing';
import { ShelterSupplyService } from './shelter-supply.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('ShelterSupplyService', () => {
  let service: ShelterSupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShelterSupplyService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    service = module.get<ShelterSupplyService>(ShelterSupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
