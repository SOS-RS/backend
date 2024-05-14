import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { SupplyPriority } from 'src/supply/types';

export class UpdateShelterSupplyDTO {
  @ApiProperty({
    required: false,
    description: 'Prioridade de suprimento',
    enum: SupplyPriority,
  })
  @IsOptional()
  @IsEnum(SupplyPriority)
  @Transform((value) => Number(value.value))
  readonly priority?: SupplyPriority;

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
