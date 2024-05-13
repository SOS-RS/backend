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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserGuard } from '@/guards/user.guard';
import { ServerResponse } from '../utils';
import { UsersService } from './users.service';
import { AdminGuard } from '@/guards/admin.guard';
import { CreateUserDTO } from './dtos/CreateUserDTO';
import { UpdateUserDTO } from './dtos/UpdateUserDTO';

@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  private logger = new Logger(UsersController.name);

  constructor(private readonly userServices: UsersService) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse()
  @Post('')
  @UseGuards(AdminGuard)
  async store(@Body() body: CreateUserDTO) {
    try {
      await this.userServices.store(body);
      return new ServerResponse(201, 'Successfully created user');
    } catch (err: any) {
      this.logger.error(`Failed to store user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse()
  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Body() body: UpdateUserDTO, @Param('id') id: string) {
    try {
      await this.userServices.update(id, body);
      return new ServerResponse(201, 'Successfully updated user');
    } catch (err: any) {
      this.logger.error(`Failed to update user: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiInternalServerErrorResponse()
  @ApiCreatedResponse()
  @Put('')
  @UseGuards(UserGuard)
  async selfUpdate(@Body() body: UpdateUserDTO, @Req() req) {
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
