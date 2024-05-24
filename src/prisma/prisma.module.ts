import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
