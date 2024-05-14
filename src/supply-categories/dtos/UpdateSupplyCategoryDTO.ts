import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateSupplyCategoryDTO {
  @ApiProperty({
    required: false,
    type: 'string',
    example: 'Nome da categoria do suprimento',
  })
  @IsOptional()
  @IsString()
  readonly name?: string;
}
