import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TripsService } from './trips.service';

@ApiTags('Trips')
@Controller('trips')
export class TripsController {
  private logger = new Logger(TripsController.name);

  constructor(private readonly tripsService: TripsService) {}
}
