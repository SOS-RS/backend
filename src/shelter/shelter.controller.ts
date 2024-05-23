import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

import { UserDecorator } from '@/decorators/UserDecorator/user.decorator';
import { ApplyUser } from '@/guards/apply-user.guard';
import { StaffGuard } from '@/guards/staff.guard';
import { FastifyFileInterceptor } from '@/interceptors/file-upload.interceptor';
import { ServerResponse } from '../utils';
import { ShelterService } from './shelter.service';

import { AdminGuard } from '@/guards/admin.guard';
import { createReadStream, rmSync } from 'fs';
import { diskStorage } from 'multer';
import { FileDtoStub } from 'src/shelter-csv-importer/dto/file.dto';
import { csvImporterFilter } from 'src/shelter-csv-importer/shelter-csv-importer.helpers';
import { ShelterCsvImporterService } from 'src/shelter-csv-importer/shelter-csv-importer.service';
import { Readable } from 'stream';

@ApiTags('Abrigos')
@Controller('shelters')
export class ShelterController {
  private logger = new Logger(ShelterController.name);

  constructor(
    private readonly shelterService: ShelterService,
    private readonly shelterCsvImporter: ShelterCsvImporterService,
  ) {}

  @Get('')
  async index(@Query() query) {
    try {
      const data = await this.shelterService.index(query);
      return new ServerResponse(200, 'Successfully get shelters', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelters: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get('cities')
  async cities() {
    try {
      const data = await this.shelterService.getCities();
      return new ServerResponse(200, 'Successfully get shelters cities', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelters cities: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get(':id')
  @UseGuards(ApplyUser)
  async show(@UserDecorator() user: any, @Param('id') id: string) {
    try {
      const isLogged =
        Boolean(user) && Boolean(user?.sessionId) && Boolean(user?.userId);
      const data = await this.shelterService.show(id, isLogged);
      return new ServerResponse(200, 'Successfully get shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Post('')
  @UseGuards(StaffGuard)
  async store(@Body() body) {
    try {
      const data = await this.shelterService.store(body);
      return new ServerResponse(200, 'Successfully created shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed to create shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.shelterService.update(id, body);
      return new ServerResponse(200, 'Successfully updated shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed update shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':id/admin')
  @UseGuards(StaffGuard)
  async fullUpdate(@Param('id') id: string, @Body() body) {
    try {
      const data = await this.shelterService.fullUpdate(id, body);
      return new ServerResponse(200, 'Successfully updated shelter', data);
    } catch (err: any) {
      this.logger.error(`Failed to update shelter: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @UseGuards(AdminGuard)
  @Post('import-csv')
  @ApiConsumes('multipart/form-data', 'text/csv')
  @UseInterceptors(
    FastifyFileInterceptor('file', {
      storage: diskStorage({
        filename: (_req, file, cb) => cb(null, file.originalname),
      }),
      fileFilter: csvImporterFilter,
    }),
  )
  async importFromCsv(
    @Req() _req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: FileDtoStub,
  ) {
    let fileStream!: Readable;
    if (file?.path) {
      fileStream = createReadStream(file.path);
    }

    const res = await this.shelterCsvImporter.execute({
      fileStream,
      csvUrl: body?.csvUrl,
      useBatchTransaction: true,
    });
    if (file?.path) {
      rmSync(file.path);
    }

    return res;
  }
}
