import { Module } from '@nestjs/common';
import { TransportManagersService } from './transport-managers.service';
import { TransportManagersController } from './transport-managers.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TransportManagersService],
  controllers: [TransportManagersController],
})
export class TransportManagersModule {}
