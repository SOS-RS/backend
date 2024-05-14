import { Test, TestingModule } from '@nestjs/testing';
import { ShelterManagersController } from './shelter-managers.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ShelterManagersService } from './shelter-managers.service';

describe('ShelterManagersController', () => {
  let controller: ShelterManagersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShelterManagersController],
      providers: [ShelterManagersService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .compile();

    controller = module.get<ShelterManagersController>(
      ShelterManagersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
