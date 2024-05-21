import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { ServerResponse } from '../utils';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@/guards/admin.guard';

@ApiTags('Parceiros')
@Controller('partners')
export class PartnersController {
  private logger = new Logger(PartnersController.name);

  constructor(private readonly partnersService: PartnersService) {}

  @Get('')
  async index() {
    try {
      const data = await this.partnersService.index();
      return new ServerResponse(200, 'Successfully get partners', data);
    } catch (err: any) {
      this.logger.error(`Failed to get partners: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(AdminGuard)
  async store(@Body() body) {
    try {
      await this.partnersService.store(body);
      return new ServerResponse(201, 'Successfully created partner');
    } catch (err: any) {
      this.logger.error(`Failed to create partner: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
