import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({ type: 'string', example: 'John' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ type: 'string', example: 'Doe' })
  @IsOptional()
  @IsString()
  readonly lastName?: string;

  @ApiProperty({ type: 'string', example: 'John' })
  @IsOptional()
  @IsString()
  readonly login?: string;

  @ApiProperty({ type: 'string', example: 'john123' })
  @IsOptional()
  @IsString()
  readonly password?: string;

  @ApiProperty({ type: 'string', example: '(55) 99671-6164' })
  @IsOptional()
  @IsString()
  readonly phone?: string;
}
