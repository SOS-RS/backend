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
  Request,
  UseGuards,
} from '@nestjs/common';

import { DonationOrderService } from './donation-order.service';
import { ServerResponse } from '../utils';
import { UserGuard } from '@/guards/user.guard';

@Controller('donation/order')
export class DonationOrderController {
  private logger = new Logger(DonationOrderController.name);

  constructor(private readonly donationOrderService: DonationOrderService) {}

  @Post('')
  @UseGuards(UserGuard)
  async store(@Body() body) {
    try {
      await this.donationOrderService.store(body);
      return new ServerResponse(200, 'Successfully store donation order');
    } catch (err: any) {
      this.logger.error(`Failed to store donation order: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':orderId')
  @UseGuards(UserGuard)
  async update(@Param('orderId') orderId: string, @Body() body) {
    try {
      await this.donationOrderService.update(orderId, body);
      return new ServerResponse(200, 'Successfully updated donation order');
    } catch (err: any) {
      this.logger.error(`Failed to update donation order: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get(':shelterId')
  @UseGuards(UserGuard)
  async index(
    @Param('shelterId') shelterId: string,
    @Query() query,
    @Request() req,
  ) {
    try {
      const { userId } = req.user;
      await this.donationOrderService.index(shelterId, userId, query);
      return new ServerResponse(200, 'Successfully get all donation orders');
    } catch (err: any) {
      this.logger.error(`Failed to get all donation orders: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
