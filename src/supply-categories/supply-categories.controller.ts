import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { SupplyCategoriesService } from './supply-categories.service';
import { ServerResponse } from '../utils';
import { StaffGuard } from '@/guards/staff.guard';
import { SupplyCategoriesDto } from 'src/dto/supply-categories/supply-categories.dto';
import { UpdateSupplyCategoriesDto } from 'src/dto/supply-categories/update-supply-categories.dto';

@ApiTags('Categoria de Suprimentos')
@Controller('supply-categories')
export class SupplyCategoriesController {
  private logger = new Logger(SupplyCategoriesController.name);

  constructor(
    private readonly supplyCategoryServices: SupplyCategoriesService,
  ) {}

  @Get('')
  @ApiOperation({ summary: 'Search for supplies categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully get supply categories',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to get supply categories',
  })
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
  @ApiOperation({ summary: 'Create supply category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully created supply category',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to create supply categories',
  })
  @UseGuards(StaffGuard)
  async store(@Body() body: SupplyCategoriesDto) {
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully updated supply category',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Failed to update supply category',
  })
  @ApiOperation({ summary: 'Update supply category with id' })
  @UseGuards(StaffGuard)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateSupplyCategoriesDto,
  ) {
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
