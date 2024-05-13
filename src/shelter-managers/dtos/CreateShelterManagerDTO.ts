import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShelterManagerDTO {
  @ApiProperty({ type: 'string', example: 'ID do Abrigo' })
  @IsNotEmpty()
  @IsString()
  readonly shelterId = '';

  @ApiProperty({ type: 'string', example: 'ID do Usuário' })
  @IsNotEmpty()
  @IsString()
  readonly userId = '';
}
