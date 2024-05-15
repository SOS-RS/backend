import { Controller, Get, HttpException, Logger } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { ServerResponse } from '../utils';

@Controller('partners')
export class PartnersController {
  private logger = new Logger(PartnersController.name);

  constructor(private readonly partnersService: PartnersService) {}

  @Get('')
  async index() {
    try {
      const data = await this.partnersService.index();
      return new ServerResponse(200, 'Successfully get partners', data);
    } catch (err: any) {
      this.logger.error(`Failed to get partners: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
