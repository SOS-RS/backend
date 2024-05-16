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
import { TransportsService } from './transports.service';
import { ServerResponse } from '../utils';
import { StaffGuard } from '@/guards/staff.guard';

@ApiTags('Transports')
@Controller('transports')
export class TransportsController {
  private logger = new Logger(TransportsController.name);

  constructor(private readonly transportsService: TransportsService) {}

  @Get('')
  async index(@Query() query) {
    try {
      const data = await this.transportsService.index(query);
      return new ServerResponse(200, 'Successfully get transports', data);
    } catch (err: any) {
      this.logger.error(`Failed to get transports: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    try {
      const data = await this.transportsService.show(id);
      return new ServerResponse(200, 'Successfully get transport', data);
    } catch (err: any) {
      this.logger.error(`Failed to get transport: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(StaffGuard)
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
  @UseGuards(StaffGuard)
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
