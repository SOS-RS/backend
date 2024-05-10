import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  Logger,
  Param,
  ParseIntPipe,
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
  async top(
    @Query('perPage', new DefaultValuePipe(10), ParseIntPipe) perPage: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('shelterId') shelterId: string,
  ) {
    try {
      const data = await this.supplyServices.top({ perPage, page, shelterId });
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
