import { Injectable } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Parceiros')
@Injectable()
export class PartnersService {
  constructor(private readonly prismaService: PrismaService) {}

  async index() {
    return await this.prismaService.partners.findMany({});
  }
}
