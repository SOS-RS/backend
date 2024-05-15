import {
  Body,
  Controller,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { UserGuard } from '@/guards/user.guard';
import { ServerResponse } from '../utils';
import { UsersService } from './users.service';
import { AdminGuard } from '@/guards/admin.guard';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly userServices: UsersService) {}

  @Post('')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cria um novo usuário',
    description: 'Esta rota é usada para criar um novo usuário no sistema.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
      },
      required: ['name', 'lastName', 'phone'],
    },
    examples: {
      'Exemplo 1': {
        value: {
          name: 'Dinho',
          lastName: 'Duarte',
          phone: '(31) 996675945',
        },
      },
    },
  })
  async store(@Body() body) {
    try {
      await this.userServices.store(body);
      return new ServerResponse(201, 'Successfully created user');
    } catch (err: any) {
      this.logger.error(`Failed to store user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza um usuário pelo ID',
    description:
      'Esta rota é usada para atualizar um usuário específico no sistema, podendo ser informado um ou mais campos.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        login: { type: 'string' },
        password: { type: 'string' },
      },
      required: [],
    },
    examples: {
      'Exemplo 1': {
        value: {
          name: 'Dinho',
          lastName: 'Duarte',
          phone: '(31) 996675945',
          login: 'dinho duarte',
          password: '123456',
        },
      },
    },
  })
  async update(@Body() body, @Param('id') id: string) {
    try {
      await this.userServices.update(id, body);
      return new ServerResponse(201, 'Successfully updated user');
    } catch (err: any) {
      this.logger.error(`Failed to update user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put('')
  @UseGuards(UserGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualiza o seu próprio usuário',
    description:
      'Esta rota é usada para atualizar o próprio usuário no sistema, podendo ser informado um ou mais campos.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        lastName: { type: 'string' },
        phone: { type: 'string' },
        login: { type: 'string' },
        password: { type: 'string' },
      },
      required: [],
    },
    examples: {
      'Exemplo 1': {
        value: {
          name: 'Dinho',
          lastName: 'Duarte',
          phone: '(31) 996675945',
          login: 'dinho duarte',
          password: '123456',
        },
      },
    },
  })
  async selfUpdate(@Body() body, @Req() req) {
    try {
      const { userId } = req.user;
      await this.userServices.update(userId, body);
      return new ServerResponse(201, 'Successfully updated');
    } catch (err: any) {
      this.logger.error(`Failed to update user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
