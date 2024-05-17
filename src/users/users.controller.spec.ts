import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            store: jest.fn(),
            create: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('store function', () => {
    const body = {
      name: "Matheus",
      lastName: "Silva",
      phone: "44999998311",
    }

    it('checks if the function has been called 1 time', async () => {
      await controller.store(body)
      expect(userService.store).toHaveBeenCalledTimes(1)
    });

    it('checks the return of the function', async () => {
      const expectedResult = {
        message: "Successfully created user",
        respData: undefined,
        statusCode: 201,
      }
      const result = await controller.store(body)
      expect(expectedResult.statusCode).toEqual(201)
      expect(expectedResult.message).toEqual("Successfully created user")
      expect(expectedResult).toEqual(result)

    });

    it('checks if the function fails', async () => {
      jest.spyOn(userService, 'store').mockRejectedValueOnce(new Error());
      expect(controller.store(body)).rejects.toThrow()
    })
  })
});
