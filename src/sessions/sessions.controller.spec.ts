import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;
  let service: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [SessionsService, JwtService],
    })
      .useMocker((token) => {
        if (token === PrismaService) {
          return {};
        }
      })
      .overrideProvider(SessionsService)
      .useValue({
        login: jest.fn().mockResolvedValue('token'),
        show: jest.fn().mockResolvedValue('token'),
        delete: jest.fn().mockResolvedValue('token'),
      })
      .compile();

    module.useLogger({
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      verbose: jest.fn(),
    });
    controller = module.get<SessionsController>(SessionsController);
    service = module.get<SessionsService>(SessionsService);
  });

  it('should return a token', async () => {
    const expectedResponse = {
      statusCode: 200,
      message: 'Successfully logged in',
      respData: 'token',
    };
    const res = await controller.login(
      {
        email: 'test@test.com',
        password: 'password',
      },
      '127.0.0.1',
      'user-agent',
    );
    expect(res).toEqual(expectedResponse);
  });

  it('should throw an error when login', async () => {
    jest.spyOn(service, 'login').mockRejectedValue(new Error('Error'));
    await expect(
      controller.login(
        {
          email: 'test@test.com',
          password: 'password',
        },
        '127.0.0.1',
        'user-agent',
      ),
    ).rejects.toThrow();
  });

  it('should show a session', async () => {
    const expectedResponse = {
      statusCode: 200,
      message: 'Successfully logged in',
      respData: 'token',
    };
    const res = await controller.show({ user: { userId: 1 } });
    expect(res).toEqual(expectedResponse);
  });

  it('should throw an error when show an user', async () => {
    jest.spyOn(service, 'show').mockRejectedValue(new Error('Error'));
    await expect(controller.show({ user: { userId: 1 } })).rejects.toThrow();
  });

  it('should delete a session', async () => {
    const expectedResponse = {
      statusCode: 200,
      message: 'Successfully logged out',
      respData: 'token',
    };

    const res = await controller.delete({ user: { userId: 1 } });
    expect(res).toEqual(expectedResponse);
  });

  it('should throw an error when delete a session', async () => {
    jest.spyOn(service, 'delete').mockRejectedValue(new Error('Error'));
    await expect(controller.delete({ user: { userId: 1 } })).rejects.toThrow();
  });
});
