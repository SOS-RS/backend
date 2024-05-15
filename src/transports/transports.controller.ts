import { Controller, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransportsService } from './transports.service';

@ApiTags('Transports')
@Controller('transports')
export class TransportsController {
  private logger = new Logger(TransportsController.name);

  constructor(private readonly transportsService: TransportsService) {}
}
