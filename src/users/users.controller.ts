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
import { ApiTags } from '@nestjs/swagger';

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
