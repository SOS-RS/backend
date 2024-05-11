import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ShelteredPeopleService } from './sheltered-people.service';
import { ServerResponse } from '../utils';
import { StaffGuard } from '@/guards/staff.guard';

@ApiTags('Abrigados')
@Controller('shelter/people')
export class ShelteredPeopleController {
  private logger = new Logger(ShelteredPeopleController.name);

  constructor(
    private readonly shelteredPeopleService: ShelteredPeopleService,
  ) {}

  @Get('')
  async index(@Query() query) {
    try {
      const data = await this.shelteredPeopleService.index(query);
      return new ServerResponse(200, 'Successfully get sheltered', data);
    } catch (err: any) {
      this.logger.error(`Failed to get sheltered: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    try {
      const data = await this.shelteredPeopleService.show(id);
      return new ServerResponse(200, 'Successfully get sheltered person', data);
    } catch (err: any) {
      this.logger.error(`Failed to get sheltered person: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(StaffGuard)
  async store(@Body() body) {
    try {
      const data = await this.shelteredPeopleService.store(body);
      return new ServerResponse(200, 'Successfully created sheltered person', data);
    } catch (err: any) {
      this.logger.error(`Failed to create sheltered person: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.shelteredPeopleService.update(id, body);
      return new ServerResponse(200, 'Successfully updated sheltered person', data);
    } catch (err: any) {
      this.logger.error(`Failed update sheltered person: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id/admin')
  @UseGuards(StaffGuard)
  async fullUpdate(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.shelteredPeopleService.fullUpdate(id, body);
      return new ServerResponse(200, 'Successfully updated sheltered', data);
    } catch (err: any) {
      this.logger.error(`Failed to update sheltered: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
