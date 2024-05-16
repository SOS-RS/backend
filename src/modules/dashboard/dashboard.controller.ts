import { Controller, Get, HttpException, Logger, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ServerResponse } from '@/utils/utils';

@Controller('dashboard')
export class DashboardController {
  private logger = new Logger();
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  async index() {
    try {
      const data = await this.dashboardService.index();
      return new ServerResponse(200, 'Successfully get dashboard', data);
    } catch (err: any) {
      this.logger.error(`Failed to get shelters: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
