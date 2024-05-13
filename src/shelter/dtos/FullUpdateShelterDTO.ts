import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';

export class FullUpdateShelterDTO {
  @ApiProperty({ required: false, type: 'string', example: 'Nome do Abrigo' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ required: false, type: 'string', example: 'PIX do Abrigo' })
  @IsOptional()
  @IsString()
  readonly pix?: string;

  @ApiProperty({
    required: false,
    type: 'string',
    example: 'Endereço do Abrigo',
  })
  @IsOptional()
  @IsString()
  readonly address?: string;

  @ApiProperty({ required: false, type: 'boolean', example: true })
  @IsOptional()
  @IsBoolean()
  readonly petFriendly?: boolean;

  @ApiProperty({ required: false, type: 'number', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly shelteredPeople?: number;

  @ApiProperty({ required: false, type: 'number', example: 123.456 })
  @IsOptional()
  @IsNumber()
  readonly latitude?: number;

  @ApiProperty({ required: false, type: 'number', example: 654.321 })
  @IsOptional()
  @IsNumber()
  readonly longitude?: number;

  @ApiProperty({ required: false, type: 'number', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly capacity?: number;

  @ApiProperty({
    required: false,
    type: 'string',
    example: 'Contato do Abrigo',
  })
  @IsOptional()
  @IsString()
  readonly contact?: string;

  @ApiProperty({ required: false, type: 'boolean' })
  @IsOptional()
  @IsBoolean()
  readonly verified?: boolean;
}
