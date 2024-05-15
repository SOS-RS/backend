import { Body, Controller, HttpException, Logger, Post } from '@nestjs/common';
import { TransportManagersService } from './transport-managers.service';
import { ApiTags } from '@nestjs/swagger';
import { ServerResponse } from '../utils';

@ApiTags('Transport Managers')
@Controller('transport/managers')
export class TransportManagersController {
  private logger = new Logger(TransportManagersController.name);

  constructor(
    private readonly transportManagersService: TransportManagersService,
  ) {}

  @Post('')
  async store(@Body() body) {
    try {
      await this.transportManagersService.store(body);
      return new ServerResponse(200, 'Successfully added manager to transport');
    } catch (err: any) {
      this.logger.error(`Failed to added manager to transport: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
