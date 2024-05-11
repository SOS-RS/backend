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

import { SupplyCategoriesService } from './supply-categories.service';
import { ServerResponse } from '../utils';
import { AdminGuard } from '@/guards/admin.guard';

@ApiTags('Categoria de Suprimentos')
@Controller('supply-categories')
export class SupplyCategoriesController {
  private logger = new Logger(SupplyCategoriesController.name);

  constructor(
    private readonly supplyCategoryServices: SupplyCategoriesService,
  ) {}

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

  @Post('')
  @UseGuards(AdminGuard)
  async store(@Body() body) {
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

  @Put(':id')
  @UseGuards(AdminGuard)
  async update(@Param('id') id: string, @Body() body) {
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
