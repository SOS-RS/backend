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

import { SupplyCategoriesService } from './supply-categories.service';
import { ServerResponse } from '../utils';
import { AdminGuard } from '@/guards/admin.guard';
import { CreateSupplyCategoryDTO } from './dtos/CreateSupplyCategoryDTO';
import { UpdateSupplyCategoryDTO } from './dtos/UpdateSupplyCategoryDTO';

@ApiTags('Categoria de Suprimentos')
@ApiInternalServerErrorResponse()
@Controller('supply-categories')
export class SupplyCategoriesController {
  private logger = new Logger(SupplyCategoriesController.name);

  constructor(
    private readonly supplyCategoryServices: SupplyCategoriesService,
  ) {}

  @ApiOkResponse()
  @Get('')
  async index() {
    try {
      const data = await this.supplyCategoryServices.index();
      return new ServerResponse(
        200,
        'Successfully get supply categories',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to get supply categories: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Post('')
  @UseGuards(AdminGuard)
  async store(@Body() body: CreateSupplyCategoryDTO) {
    try {
      const data = await this.supplyCategoryServices.store(body);
      return new ServerResponse(
        200,
        'Successfully created supply category',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to create supply category: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body: UpdateSupplyCategoryDTO) {
    try {
      const data = await this.supplyCategoryServices.update(id, body);
      return new ServerResponse(
        200,
        'Successfully updated supply category',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to update supply category: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
