import {
  Body,
  Controller,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransportsService } from './transports.service';
import { ServerResponse } from '../utils';

@ApiTags('Transports')
@Controller('transports')
export class TransportsController {
  private logger = new Logger(TransportsController.name);

  constructor(private readonly transportsService: TransportsService) {}

  @Post('')
  async store(@Body() body) {
    try {
      const data = await this.transportsService.store(body);
      return new ServerResponse(200, 'Successfully created transport', data);
    } catch (err: any) {
      this.logger.error(`Failed to create transport: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.transportsService.update(id, body);
      return new ServerResponse(200, 'Successfully updated transport', data);
    } catch (err: any) {
      this.logger.error(`Failed update transport: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
