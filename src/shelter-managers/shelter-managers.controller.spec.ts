import { Test, TestingModule } from '@nestjs/testing';
import { ShelterManagersController } from './shelter-managers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShelterManagersService } from './shelter-managers.service';

describe('ShelterManagersController', () => {
  let controller: ShelterManagersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShelterManagersService],
      controllers: [ShelterManagersController],
    }).compile();

    controller = module.get<ShelterManagersController>(
      ShelterManagersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
