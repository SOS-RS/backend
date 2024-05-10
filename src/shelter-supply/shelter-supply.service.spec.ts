import { Test, TestingModule } from '@nestjs/testing';
import { ShelterSupplyService } from './shelter-supply.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShelterSupplyController } from './shelter-supply.controller';

describe('ShelterSupplyService', () => {
  let service: ShelterSupplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShelterSupplyService],
      controllers: [ShelterSupplyController],
    }).compile();

    service = module.get<ShelterSupplyService>(ShelterSupplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
