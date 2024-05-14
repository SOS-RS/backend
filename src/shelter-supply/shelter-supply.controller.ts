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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ShelterSupplyService } from './shelter-supply.service';
import { ServerResponse } from '../utils';
import { DistributionCenterGuard } from '@/guards/distribution-center.guard';
import { CreateShelterSupplyDTO } from './dtos/CreateShelterSupplyDTO';
import { UpdateShelterSupplyDTO } from './dtos/UpdateShelterSupplyDTO';
import { UpdateManyShelterSupplySchemaDTO } from './dtos/UpdateManyShelterSupplyDTO';

@ApiTags('Suprimento de abrigos')
@ApiInternalServerErrorResponse()
@Controller('shelter/supplies')
export class ShelterSupplyController {
  private logger = new Logger(ShelterSupplyController.name);

  constructor(private readonly shelterSupplyService: ShelterSupplyService) {}

  @ApiOkResponse()
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

  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Post('')
  async store(@Body() body: CreateShelterSupplyDTO) {
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

  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Put(':shelterId/:supplyId')
  async update(
    @Body() body: UpdateShelterSupplyDTO,
    @Param('shelterId') shelterId: string,
    @Param('supplyId') supplyId: string,
  ) {
    try {
      const data = await this.shelterSupplyService.update(
        body,
        shelterId,
        supplyId,
      );
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

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Put(':shelterId/supplies/many')
  @UseGuards(DistributionCenterGuard)
  async updateMany(
    @Body() body: UpdateManyShelterSupplySchemaDTO,
    @Param('shelterId') shelterId: string,
  ) {
    try {
      const data = await this.shelterSupplyService.updateMany(body, shelterId);
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
