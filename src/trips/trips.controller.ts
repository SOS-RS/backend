import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { ServerResponse } from '../utils';
import { TransportManagerGuard } from '@/guards/transport-manager.guard';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  private logger = new Logger(TripsController.name);

  constructor(private readonly tripsService: TripsService) {}

  @Get(':id')
  async show(@Param('id') id: string) {
    try {
      const data = await this.tripsService.show(id);
      return new ServerResponse(200, 'Successfully get trip', data);
    } catch (err: any) {
      this.logger.error(`Failed to get trip: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(TransportManagerGuard)
  async store(@Body() body, @Request() req) {
    try {
      const { userId } = req.user;
      const data = await this.tripsService.store(body, userId);
      return new ServerResponse(200, 'Successfully created trip', data);
    } catch (err: any) {
      this.logger.error(`Failed to create trip: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  @UseGuards(TransportManagerGuard)
  async update(@Param('id') id: string, @Body() body, @Request() req) {
    try {
      const { userId } = req.user;
      const data = await this.tripsService.update(id, body, userId);
      return new ServerResponse(200, 'Successfully updated trip', data);
    } catch (err: any) {
      this.logger.error(`Failed update trip: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Delete(':id')
  @UseGuards(TransportManagerGuard)
  async cancel(@Param('id') id: string, @Request() req) {
    try {
      const { userId } = req.user;
      const data = await this.tripsService.cancel(id, userId);
      return new ServerResponse(200, 'Successfully canceled trip', data);
    } catch (err: any) {
      this.logger.error(`Failed canceled trip: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
