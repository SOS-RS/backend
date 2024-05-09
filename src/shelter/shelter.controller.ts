import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ShelterService } from './shelter.service';
import { ServerResponse } from '../utils';
import { SearchQuery } from '../decorators';
import { SeachQueryProps } from '@/decorators/search-query/types';
import { StaffGuard } from '@/guards/staff.guard';
import { UserGuard } from '@/guards/user.guard';

@ApiTags('Abrigos')
@Controller('shelters')
export class ShelterController {
  private logger = new Logger(ShelterController.name);

  constructor(private readonly shelterService: ShelterService) {}

  @Get('')
  async index(@SearchQuery() searchQueryParams: SeachQueryProps) {
    try {
      const data = await this.shelterService.index(searchQueryParams);
      return new ServerResponse(200, 'Successfully get shelters', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelters: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    try {
      const data = await this.shelterService.show(id);
      return new ServerResponse(200, 'Successfully get shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(UserGuard)
  async store(@Body() body) {
    try {
      const data = await this.shelterService.store(body);
      return new ServerResponse(200, 'Successfully created shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed to create shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.shelterService.update(id, body);
      return new ServerResponse(200, 'Successfully updated shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed update shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id/admin')
  @UseGuards(StaffGuard)
  async fullUpdate(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.shelterService.fullUpdate(id, body);
      return new ServerResponse(200, 'Successfully updated shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed to update shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
