import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Suprimentos')
@Controller('supply')
export class SupplyController {}
