import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SessionsService } from './sessions.service';

jest.mock('bcrypt');
describe('SessionsService', () => {
  let service: SessionsService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
            session: {
              updateMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SessionsService>(SessionsService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('login', () => {
    it('should throw an error if user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({
          login: 'test',
          password: 'password',
          ip: '127.0.0.1',
          userAgent: 'test',
        }),
      ).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw an error if password is incorrect', async () => {
      const user = { id: 1, login: 'test', password: 'hashedpassword' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          login: 'test',
          password: 'wrongpassword',
          ip: '127.0.0.1',
          userAgent: 'test',
        }),
      ).rejects.toThrow('Senha incorreta');
    });

    it('should return a token if login is successful', async () => {
      const user = { id: 1, login: 'test', password: 'hashedpassword' };
      const session = { id: 1, userId: 1 };
      const token = 'token';
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (prismaService.session.updateMany as jest.Mock).mockResolvedValue({});
      (prismaService.session.create as jest.Mock).mockResolvedValue(session);
      (jwtService.sign as jest.Mock).mockReturnValue(token);

      const result = await service.login({
        login: 'test',
        password: 'password',
        ip: '127.0.0.1',
        userAgent: 'test',
      });

      expect(result).toEqual({ token });
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { login: 'test' },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedpassword');
      expect(prismaService.session.updateMany).toHaveBeenCalledWith({
        where: { user: { login: 'test' }, active: true },
        data: { active: false, updatedAt: expect.any(String) },
      });
      expect(prismaService.session.create).toHaveBeenCalledWith({
        data: {
          userId: user.id,
          ip: '127.0.0.1',
          userAgent: 'test',
          createdAt: expect.any(String),
        },
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sessionId: session.id,
        userId: user.id,
      });
    });
  });

  describe('show', () => {
    it('should return user data if user is found', async () => {
      const user = {
        id: '1',
        name: 'Test User',
        login: 'test',
        phone: '123456789',
        accessLevel: 'admin',
        createdAt: new Date(),
      };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(user);

      const result = await service.show('1');

      expect(result).toEqual(user);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          name: true,
          login: true,
          phone: true,
          accessLevel: true,
          createdAt: true,
        },
      });
    });

    it('should return null if user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.show('1');

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select: {
          id: true,
          name: true,
          login: true,
          phone: true,
          accessLevel: true,
          createdAt: true,
        },
      });
    });
  });

  describe('delete', () => {
    it('should deactivate session if session and user match', async () => {
      const session = {
        id: '1',
        userId: '1',
        updatedAt: new Date(),
        active: false,
      };
      (prismaService.session.update as jest.Mock).mockResolvedValue(session);

      const result = await service.delete({ sessionId: '1', userId: '1' });

      expect(result).toEqual(session);
      expect(prismaService.session.update).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1',
        },
        data: {
          updatedAt: expect.any(String),
          active: false,
        },
      });
    });

    it('should return null if session does not exist', async () => {
      (prismaService.session.update as jest.Mock).mockResolvedValue(null);

      const result = await service.delete({ sessionId: '1', userId: '1' });

      expect(result).toBeNull();
      expect(prismaService.session.update).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: '1',
        },
        data: {
          updatedAt: expect.any(String),
          active: false,
        },
      });
    });
  });
});
