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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ServerResponse } from '../utils';
import { SupplyService } from './supply.service';

@ApiTags('Suprimentos')
@Controller('supplies')
export class SupplyController {
  private logger = new Logger(SupplyController.name);

  constructor(private readonly supplyServices: SupplyService) {}

  @Get('')
  async index() {
    try {
      const data = await this.supplyServices.index();
      return new ServerResponse(200, 'Successfully get supplies', data);
    } catch (err: any) {
      this.logger.error(`Failed to get supplies: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get('top')
  async top(@Query('limit') limit: number = 10, @Query('skip') skip: number) {
    try {
      if (limit && typeof limit === 'string') {
        limit = Number.parseInt(limit);
      }
      if (skip && typeof skip === 'string') {
        skip = Number.parseInt(skip);
      }
      const data = await this.supplyServices.top(limit, skip);
      return new ServerResponse(200, 'Successfully get top supplies', data);
    } catch (err: any) {
      this.logger.error(`Failed to get supplies: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  async store(@Body() body) {
    try {
      const data = await this.supplyServices.store(body);
      return new ServerResponse(200, 'Successfully created supply', data);
    } catch (err: any) {
      this.logger.error(`Failed to create supply: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.supplyServices.update(id, body);
      return new ServerResponse(200, 'Successfully updated supply', data);
    } catch (err: any) {
      this.logger.error(`Failed to update supply: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
