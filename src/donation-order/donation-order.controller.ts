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
import { ApiTags } from '@nestjs/swagger';

import { DonationOrderService } from './donation-order.service';
import { ServerResponse } from '../utils';
import { UserGuard } from '@/guards/user.guard';

@ApiTags('Doações')
@Controller('donation/order')
export class DonationOrderController {
  private logger = new Logger(DonationOrderController.name);

  constructor(private readonly donationOrderService: DonationOrderService) {}

  @Post('')
  @UseGuards(UserGuard)
  async store(@Body() body, @Request() req) {
    try {
      const { userId } = req.user;
      const data = await this.donationOrderService.store({ ...body, userId });
      return new ServerResponse(200, 'Successfully store donation order', data);
    } catch (err: any) {
      this.logger.error(`Failed to store donation order: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Put(':orderId')
  @UseGuards(UserGuard)
  async update(
    @Request() req,
    @Param('orderId') orderId: string,
    @Body() body,
  ) {
    try {
      const { userId } = req.user;
      await this.donationOrderService.update(orderId, userId, body);
      return new ServerResponse(200, 'Successfully updated donation order');
    } catch (err: any) {
      this.logger.error(`Failed to update donation order: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get('')
  @UseGuards(UserGuard)
  async index(@Query() query, @Request() req) {
    try {
      const { userId } = req.user;
      const data = await this.donationOrderService.index(userId, query);
      return new ServerResponse(
        200,
        'Successfully get all donation orders',
        data,
      );
    } catch (err: any) {
      this.logger.error(`Failed to get all donation orders: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }

  @Get(':id')
  @UseGuards(UserGuard)
  async show(@Param('id') id: string, @Request() req) {
    try {
      const { userId } = req.user;
      const data = await this.donationOrderService.show(id, userId);
      if (!data) throw new HttpException('Not founded donation order', 404);
      return new ServerResponse(200, 'Successfully get donation order', data);
    } catch (err: any) {
      this.logger.error(`Failed to get donation order: ${err}`);
      throw new HttpException(err?.code ?? err?.name ?? `${err}`, 400);
    }
  }
}
