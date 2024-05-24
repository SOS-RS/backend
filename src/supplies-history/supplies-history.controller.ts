import {
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Query,
} from '@nestjs/common';
import { SuppliesHistoryService } from './supplies-history.service';
import { ServerResponse } from '../utils';

@Controller('supplies/history')
export class SuppliesHistoryController {
  private logger = new Logger(SuppliesHistoryController.name);

  constructor(
    private readonly suppliesHistoryService: SuppliesHistoryService,
  ) {}

  @Get(':shelterId')
  async index(@Param('shelterId') shelterId: string, @Query() query) {
    try {
      const data = await this.suppliesHistoryService.index(shelterId, query);
      return new ServerResponse(200, 'Successfully get supplies history', data);
    } catch (err: any) {
      this.logger.error(`Failed to get supplies history: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
