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
import { ApiTags } from '@nestjs/swagger';

import { SupplyCategoriesService } from './supply-categories.service';
import { ServerResponse } from '../utils';
import { StaffGuard } from '@/guards/staff.guard';
import { MakeSwagger } from 'src/swagger/swagger.config';
import { SupplyCategoriesDto } from 'src/dto/supply-categories/supply-categories.dto';
import { UpdateSupplyCategoriesDto } from 'src/dto/supply-categories/update-supply-categories.dto';

@ApiTags('Categoria de Suprimentos')
@Controller('supply-categories')
export class SupplyCategoriesController {
  private logger = new Logger(SupplyCategoriesController.name);

  constructor(
    private readonly supplyCategoryServices: SupplyCategoriesService,
  ) {}

  @MakeSwagger({
    operation: {
      description: 'Search for supply categories',
      deprecated: false,
    },
    responses: [
      {
        status: HttpStatus.OK,
        description: 'Successfully get supply categories',
      },
      {
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed to get supply categories',
      },
    ],
  })
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
  @MakeSwagger({
    operation: {
      description: 'Create supply category',
      deprecated: false,
    },
    responses: [
      {
        status: HttpStatus.OK,
        description: 'Successfully created supply category',
      },
      {
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed to create supply category',
      },
    ],
  })
  @Post('')
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

  @MakeSwagger({
    operation: {
      description: 'Update supply category',
      deprecated: false,
    },
    responses: [
      {
        status: HttpStatus.OK,
        description: 'Successfully update supply category',
      },
      {
        status: HttpStatus.BAD_REQUEST,
        description: 'Failed to update supply category',
      },
    ],
  })
  @Put(':id')
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
