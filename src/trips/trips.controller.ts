import {
  Body,
  Controller,
  Delete,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { ServerResponse } from '../utils';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  private logger = new Logger(TripsController.name);

  constructor(private readonly tripsService: TripsService) {}

  @Post('')
  async store(@Body() body) {
    try {
      const data = await this.tripsService.store(body);
      return new ServerResponse(200, 'Successfully created trip', data);
    } catch (err: any) {
      this.logger.error(`Failed to create trip: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.tripsService.update(id, body);
      return new ServerResponse(200, 'Successfully updated trip', data);
    } catch (err: any) {
      this.logger.error(`Failed update trip: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Delete(':id')
  async cancel(@Param('id') id: string) {
    try {
      const data = await this.tripsService.cancel(id);
      return new ServerResponse(200, 'Successfully canceled trip', data);
    } catch (err: any) {
      this.logger.error(`Failed canceled trip: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}