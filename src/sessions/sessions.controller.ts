import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserGuard } from '@/guards/user.guard';
import { ServerResponse } from '../utils';
import { SessionsService } from './sessions.service';

@ApiTags('Sessões')
@Controller('sessions')
export class SessionsController {
  private logger = new Logger(SessionsController.name);

  constructor(private readonly sessionService: SessionsService) {}

  @Post('')
  async login(
    @Body() body,
    @Headers('x-real-ip') ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    try {
      const data = await this.sessionService.login({ ...body, ip, userAgent });
      return new ServerResponse(200, 'Successfully logged in', data);
    } catch (err: any) {
      this.logger.error(`Failed to login ${err}`);
      throw new HttpException(
        err?.message ?? err?.code ?? err?.name ?? `${err}`,
        400,
      );
    }
  }

  @Get('')
  @UseGuards(UserGuard)
  async show(@Request() req) {
    try {
      const { userId } = req.user;
      const data = await this.sessionService.show(userId);
      return new ServerResponse(200, 'Successfully logged in', data);
    } catch (err: any) {
      this.logger.error(`Failed to login ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Delete('')
  @UseGuards(UserGuard)
  async delete(@Request() req) {
    try {
      const data = await this.sessionService.delete(req.user);
      return new ServerResponse(200, 'Successfully logged out', data);
    } catch (err: any) {
      this.logger.error(`Failed to logged out ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
