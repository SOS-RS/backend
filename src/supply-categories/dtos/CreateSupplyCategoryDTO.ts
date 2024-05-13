import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSupplyCategoryDTO {
  @ApiProperty({ type: 'string', example: 'Nome da categoria do suprimento' })
  @IsNotEmpty()
  @IsString()
  readonly name = '';
}
