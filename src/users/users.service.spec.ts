import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { UpdateUserSchema } from './types';

describe('UsersService', () => {
  let userService: UsersService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      update: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
      ],
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrismaService)
    .compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('store function', () => {
    const userPayload = {
      name: 'matheus', lastName: 'silva', phone:'44999998311'
    }

    it('shold call the store function 1 time', async () => {
      userService.store(userPayload)
      expect(mockPrismaService.user.create).toHaveBeenCalledTimes(1)
    });

    it('shold call the store function with the parameters', async () => {
      userService.store(userPayload)
      const data = {
        ...userPayload,
        password: userPayload.phone,
        login: userPayload.phone,
        createdAt: new Date().toISOString(),
      }
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({ data })
    });
  });

  describe('update function', () => {
      const id = 'user_id_test';
      const body = {
        name: 'Matheus', 
        lastName: 'Silva', 
        phone:'44999998311',
      };

    it('shuld call the store function 1 time', async () => {
      userService.update(id, body)
      expect(mockPrismaService.user.update).toHaveBeenCalledTimes(1)
    });
  })
});
