import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginSessionDTO {
  @ApiProperty({ type: 'string', example: 'John' })
  @IsNotEmpty()
  @IsString()
  readonly login = '';

  @ApiProperty({ type: 'string', example: 'john123' })
  @IsNotEmpty()
  @IsString()
  readonly password = '';
}
