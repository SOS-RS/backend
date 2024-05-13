import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupplyDTO {
  @ApiProperty({ type: 'string', example: 'ID da Categoria do Suprimento' })
  @IsNotEmpty()
  @IsString()
  readonly supplyCategoryId = '';

  @ApiProperty({ type: 'string', example: 'Nome do Suprimento' })
  @IsNotEmpty()
  @IsString()
  readonly name = '';
}
