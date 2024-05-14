import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SupplyPriority } from 'src/supply/types';

export class CreateShelterSupplyDTO {
  constructor() {
    this.priority = SupplyPriority.UnderControl;
  }

  @ApiProperty({ type: 'string', example: 'ID do Abrigo' })
  @IsNotEmpty()
  @IsString()
  readonly shelterId = '';

  @ApiProperty({ type: 'string', example: 'ID do Suprimento' })
  @IsNotEmpty()
  @IsString()
  readonly supplyId = '';

  @ApiProperty({
    description: 'Prioridade de suprimento',
    enum: SupplyPriority,
  })
  @IsNotEmpty()
  @IsEnum(SupplyPriority)
  @Transform((value) => Number(value.value))
  readonly priority: SupplyPriority;

  @ApiProperty({
    required: false,
    type: 'number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform((value) => Number(value.value))
  readonly quantity?: number;
}
