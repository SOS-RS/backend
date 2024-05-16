import { Module } from '@nestjs/common';

import { SupportersService } from './supporters.service';
import { SupportersController } from './supporters.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SupportersService],
  controllers: [SupportersController],
})
export class SupportersModule {}
