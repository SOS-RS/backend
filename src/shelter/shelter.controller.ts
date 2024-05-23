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

import { ShelterService } from './shelter.service';
import { ServerResponse } from '../utils';
import { StaffGuard } from '@/guards/staff.guard';
import { ApplyUser } from '@/guards/apply-user.guard';
import { UserDecorator } from '@/decorators/UserDecorator/user.decorator';

@ApiTags('Abrigos')
@Controller('shelters')
export class ShelterController {
  private logger = new Logger(ShelterController.name);

  constructor(private readonly shelterService: ShelterService) {}

  @Get('')
  async index(@Query() query) {
    try {
      const data = await this.shelterService.index(query);
      return new ServerResponse(200, 'Successfully get shelters', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelters: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get('cities')
  async cities() {
    try {
      const data = await this.shelterService.getCities();
      return new ServerResponse(200, 'Successfully get shelters cities', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelters cities: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get(':id')
  @UseGuards(ApplyUser)
  async show(@UserDecorator() user: any, @Param('id') id: string) {
    try {
      const isLogged =
        Boolean(user) && Boolean(user?.sessionId) && Boolean(user?.userId);
      const data = await this.shelterService.show(id, isLogged);
      return new ServerResponse(200, 'Successfully get shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(StaffGuard)
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
