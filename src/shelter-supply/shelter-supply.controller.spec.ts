import { Test, TestingModule } from '@nestjs/testing';
import { ShelterSupplyController } from './shelter-supply.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterSupplyService } from './shelter-supply.service';

describe('ShelterSupplyController', () => {
  let controller: ShelterSupplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelterSupplyController],
      providers: [ShelterSupplyService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    controller = module.get<ShelterSupplyController>(ShelterSupplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
