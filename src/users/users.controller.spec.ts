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
            update: jest.fn()
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
      expect(expectedResult).toEqual(result)

    });

    it('checks if the function fails', async () => {
      jest.spyOn(userService, 'store').mockRejectedValueOnce(new Error());
      expect(controller.store(body)).rejects.toThrow()
    })
  });

  describe('update function', () => {
    const body = {
      name: "Matheus",
      lastName: "Silva",
      phone: "44999998311",
    }
    const id = 'test_user_id'

    it('checks if the function has been called 1 time', async () => {
      await controller.update(body, id);
      expect(userService.update).toHaveBeenCalledTimes(1);
    });

    it('checks the return of the function', async () => {
      const expectedResult = {
        message: "Successfully updated user",
        respData: undefined,
        statusCode: 201,
      }
      const result = await controller.update(body, id);
      expect(expectedResult).toEqual(result)

    });

    it('checks if the function fails', async () => {
      jest.spyOn(userService, 'update').mockRejectedValueOnce(new Error());
      expect(controller.update(body, id)).rejects.toThrow()
    });
  });

  describe('selfUpdate function', () => {
    const body = {
      name: "Matheus",
      lastName: "Silva",
      phone: "44999998311",
    }
    const req = {
      user: 'test_user_id'
    } 

    it('checks if the function has been called 1 time', async () => {
      await controller.selfUpdate(body, req);
      expect(userService.update).toHaveBeenCalledTimes(1);
    });

    it('checks the return of the function', async () => {
      const expectedResult = {
        message: "Successfully updated",
        respData: undefined,
        statusCode: 201,
      }
      const result = await controller.selfUpdate(body, req);
      expect(expectedResult).toEqual(result)

    });

    it('checks if the function fails', async () => {
      jest.spyOn(userService, 'update').mockRejectedValueOnce(new Error());
      expect(controller.selfUpdate(body, req)).rejects.toThrow()
    });
  });
});
