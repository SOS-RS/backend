import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterSupplyLogsController } from './shelter-supply-log.controller';
import { ShelterSupplyLogsService } from './shelter-supply-log.service';

describe('ShelterSupplyLogsController', () => {
  let controller: ShelterSupplyLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelterSupplyLogsController],
      providers: [ShelterSupplyLogsService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    controller = module.get<ShelterSupplyLogsController>(
      ShelterSupplyLogsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
