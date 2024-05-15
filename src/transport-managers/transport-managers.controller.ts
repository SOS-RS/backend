import { Controller, Logger } from '@nestjs/common';
import { TransportManagersService } from './transport-managers.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Transport Managers')
@Controller('transport/managers')
export class TransportManagersController {
  private logger = new Logger(TransportManagersController.name);

  constructor(
    private readonly transportManagersService: TransportManagersService,
  ) {}
}
