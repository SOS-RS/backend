import { Test, TestingModule } from '@nestjs/testing';
import { ShelterController } from './shelter.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ShelterService } from './shelter.service';

describe('ShelterController', () => {
  let controller: ShelterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ShelterService],
      controllers: [ShelterController],
    }).compile();

    controller = module.get<ShelterController>(ShelterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
