import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useClass: PrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
    await prismaService.user.deleteMany({});
  });

  it('Should create new user', async () => {
    const data = {
      name: 'name',
      lastName: 'lastName',
      phone: 'phone',
      password: 'password',
      login: 'login',
      createdAt: new Date().toISOString(),
    };
    await service.store(data);
    const [user] = await prismaService.user.findMany();
    expect(user.name).toBe(data.name);
    expect(user.lastName).toBe(data.lastName);
    expect(user.accessLevel).toBe('User');
  });

  it('Not should create new user if login already exists', async () => {
    const data = {
      name: 'name',
      lastName: 'lastName',
      phone: 'phone',
      password: 'password',
      login: 'login',
      createdAt: new Date().toISOString(),
    };
    await service.store(data);
    await expect(service.store(data)).rejects.toThrow();
  });
});
