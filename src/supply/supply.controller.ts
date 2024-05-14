import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ServerResponse } from '../utils';
import { SupplyService } from './supply.service';
import { CreateSupplyDTO } from './dtos/CreateSupplyDTO';
import { UpdateSupplyDTO } from './dtos/UpdateSupplyDTO';

@ApiTags('Suprimentos')
@ApiInternalServerErrorResponse()
@Controller('supplies')
export class SupplyController {
  private logger = new Logger(SupplyController.name);

  constructor(private readonly supplyServices: SupplyService) {}

  @ApiOkResponse()
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

  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Post('')
  async store(@Body() body: CreateSupplyDTO) {
    try {
      const data = await this.supplyServices.store(body);
      return new ServerResponse(200, 'Successfully created supply', data);
    } catch (err: any) {
      this.logger.error(`Failed to create supply: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateSupplyDTO) {
    try {
      const data = await this.supplyServices.update(id, body);
      return new ServerResponse(200, 'Successfully updated supply', data);
    } catch (err: any) {
      this.logger.error(`Failed to update supply: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
