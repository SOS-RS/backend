import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSupplyDTO {
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'ID da Categoria do Suprimento',
  })
  @IsOptional()
  @IsString()
  readonly supplyCategoryId?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    example: 'Nome do Suprimento',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;
}
