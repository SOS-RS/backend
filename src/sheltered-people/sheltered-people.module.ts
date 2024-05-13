import { Module } from '@nestjs/common';

import { ShelteredPeopleService } from './sheltered-people.service';
import { ShelteredPeopleController } from './sheltered-people.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ShelteredPeopleService],
  controllers: [ShelteredPeopleController],
})
export class ShelteredPeopleModule {}
