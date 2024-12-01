/* eslint-disable jest/no-conditional-expect */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ServerResponse } from '../utils';
import { PrismaService } from 'src/prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('store', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test',
        lastName: 'User',
        phone: '123456789',
      };
      const response = new ServerResponse(201, 'Successfully created user');

      jest.spyOn(service, 'store').mockResolvedValueOnce(undefined);

      expect(await controller.store(userData)).toEqual(response);
    });

    it('should throw error if creation fails', async () => {
      const body = {
        name: 'Updated',
        lastName: 'User',
        phone: '987654321',
      };
      jest
        .spyOn(service, 'store')
        .mockRejectedValueOnce(new Error('Store failed'));
      try {
        await controller.store(body);
        throw new Error('Expected update function to throw an error');
      } catch (error: any) {
        expect(error.response).toEqual('Error');
        expect(error.status).toEqual(400);
      }
    });
  });

  describe('update', () => {
    it('should update an existing user', async () => {
      const userId = '1';
      const userData = {
        name: 'Updated',
        lastName: 'User',
        phone: '987654321',
      };
      const response = new ServerResponse(201, 'Successfully updated user');

      jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

      expect(await controller.update(userData, userId)).toEqual(response);
    });

    it('should throw error if update fails', async () => {
      const id = '1';
      const userData = {
        name: 'Updated',
        lastName: 'User',
        phone: '987654321',
      };
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new Error('Update failed'));
      try {
        await controller.update(userData, id);
        throw new Error('Expected update function to throw an error');
      } catch (error: any) {
        expect(error.response).toEqual('Error');
        expect(error.status).toEqual(400);
      }
    });
  });

  describe('selfUpdate', () => {
    it('should update the own user', async () => {
      const userId = '1';
      const userData = {
        name: 'Updated',
        lastName: 'User',
        phone: '987654321',
      };
      const req = { user: { userId } };
      const response = new ServerResponse(201, 'Successfully updated');

      jest.spyOn(service, 'update').mockResolvedValueOnce(undefined);

      expect(await controller.selfUpdate(userData, req)).toEqual(response);
    });

    it('should throw error if update fails', async () => {
      const userId = '1';
      const userData = {
        name: 'Updated',
        lastName: 'User',
        phone: '987654321',
      };
      const req = { user: { userId } };
      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new Error('Update failed'));
      try {
        await controller.selfUpdate(userData, req);
        throw new Error('Expected update function to throw an error');
      } catch (error: any) {
        expect(error.response).toEqual('Error');
        expect(error.status).toEqual(400);
      }
    });
  });
});
