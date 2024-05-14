import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Query,
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

import { ShelterManagersService } from './shelter-managers.service';
import { ServerResponse } from '../utils';
import { AdminGuard } from '@/guards/admin.guard';
import { CreateShelterManagerDTO } from './dtos/CreateShelterManagerDTO';

@ApiTags('Admin de Abrigo')
@ApiInternalServerErrorResponse()
@Controller('shelter/managers')
export class ShelterManagersController {
  private logger = new Logger(ShelterManagersController.name);

  constructor(
    private readonly shelterManagerServices: ShelterManagersService,
  ) {}

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Post('')
  @UseGuards(AdminGuard)
  async store(@Body() body: CreateShelterManagerDTO) {
    try {
      await this.shelterManagerServices.store(body);
      return new ServerResponse(200, 'Successfully added manager to shelter');
    } catch (err: any) {
      this.logger.error(`Failed to added manager to shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @ApiOkResponse()
  @Get(':shelterId')
  async index(
    @Param('shelterId') shelterId: string,
    @Query('includes') includes: string,
  ) {
    try {
      const data = await this.shelterManagerServices.index(shelterId, includes);
      return new ServerResponse(200, 'Successfully get shelter managers', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelter managers: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
