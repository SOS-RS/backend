import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ type: 'string', example: 'John' })
  @IsNotEmpty()
  @IsString()
  readonly name = '';

  @ApiProperty({ type: 'string', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  readonly lastName = '';

  @ApiProperty({ type: 'string', example: '(55) 99671-6164' })
  @IsNotEmpty()
  @IsString()
  readonly phone = '';
}
