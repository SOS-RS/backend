import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';

import { SupportersService } from './supporters.service';
import { ServerResponse } from '../utils';
import { AdminGuard } from '@/guards/admin.guard';

@Controller('supporters')
export class SupportersController {
  private logger = new Logger(SupportersController.name);

  constructor(private readonly supportersService: SupportersService) {}

  @Get('')
  async index() {
    try {
      const data = await this.supportersService.index();
      return new ServerResponse(200, 'Successfully get supporters', data);
    } catch (err: any) {
      this.logger.error(`Failed to get supporters: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(AdminGuard)
  async store(@Body() body) {
    try {
      await this.supportersService.store(body);
      return new ServerResponse(200, 'Successfully created supporter');
    } catch (err: any) {
      this.logger.error(`Failed to create supporter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
