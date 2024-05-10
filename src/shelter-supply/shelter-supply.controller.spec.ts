import { Test, TestingModule } from '@nestjs/testing';
import { ShelterSupplyController } from './shelter-supply.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShelterSupplyService } from './shelter-supply.service';

describe('ShelterSupplyController', () => {
  let controller: ShelterSupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShelterSupplyService],
      controllers: [ShelterSupplyController],
    }).compile();

    controller = module.get<ShelterSupplyController>(ShelterSupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
