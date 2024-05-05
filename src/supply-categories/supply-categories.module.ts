import { Module } from '@nestjs/common';

import { SupplyCategoriesService } from './supply-categories.service';
import { SupplyCategoriesController } from './supply-categories.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SupplyCategoriesService],
  controllers: [SupplyCategoriesController],
})
export class SupplyCategoriesModule {}
