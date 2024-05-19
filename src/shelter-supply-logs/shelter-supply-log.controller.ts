import {
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DistributionCenterGuard } from '@/guards/distribution-center.guard';
import { ServerResponse } from '../utils';
import { ShelterSupplyLogsService } from './shelter-supply-log.service';

@ApiTags('Logs do suprimento de abrigos')
@Controller('shelter/supplies/logs')
export class ShelterSupplyLogsController {
  private logger = new Logger(ShelterSupplyLogsController.name);

  constructor(
    private readonly shelterSupplyLogsService: ShelterSupplyLogsService,
  ) {}

  @Get(':shelterId/:supplyId')
  @UseGuards(DistributionCenterGuard)
  async getLogs(
    @Param('shelterId') shelterId: string,
    @Param('supplyId') supplyId: string,
  ) {
    try {
      const data = await this.shelterSupplyLogsService.getLogs(
        shelterId,
        supplyId,
      );
      return new ServerResponse(
        200,
        'Successfully get shelter supplies logs',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to get shelter supplies: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
