import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ShelterSupplyService } from './shelter-supply.service';
import { ServerResponse } from '../utils';
import { DistributionCenterGuard } from '@/guards/distribution-center.guard';

@ApiTags('Suprimento de abrigos')
@Controller('shelter/supplies')
export class ShelterSupplyController {
  private logger = new Logger(ShelterSupplyController.name);

  constructor(private readonly shelterSupplyService: ShelterSupplyService) {}

  @Get(':shelterId')
  async index(@Param('shelterId') shelterId: string) {
    try {
      const data = await this.shelterSupplyService.index(shelterId);
      return new ServerResponse(200, 'Successfully get shelter supplies', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelter supplies: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  async store(@Body() body) {
    try {
      const data = await this.shelterSupplyService.store(body);
      return new ServerResponse(
        200,
        'Successfully created shelter supply',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to create shelter supply: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':shelterId/:supplyId')
  async update(
    @Body() body,
    @Param('shelterId') shelterId: string,
    @Param('supplyId') supplyId: string,
  ) {
    try {
      const data = await this.shelterSupplyService.update({
        where: { shelterId, supplyId },
        data: body,
      });
      return new ServerResponse(
        200,
        'Successfully updated shelter supply',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to update shelter supply: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':shelterId/supplies/many')
  @UseGuards(DistributionCenterGuard)
  async updateMany(@Body() body, @Param('shelterId') shelterId: string) {
    try {
      const data = await this.shelterSupplyService.updateMany({
        shelterId,
        ...body,
      });
      return new ServerResponse(
        200,
        'Successfully updated many shelter supplies',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to update many shelter supplies: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
