import {
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateShelterDTO {
  @ApiProperty({ type: 'string', example: 'Nome do Abrigo' })
  @IsNotEmpty()
  @IsString()
  readonly name = '';

  @ApiProperty({ required: false, type: 'string', example: 'PIX do Abrigo' })
  @IsOptional()
  @IsString()
  readonly pix?: string;

  @ApiProperty({ type: 'string', example: 'Endereço do Abrigo' })
  @IsNotEmpty()
  @IsString()
  readonly address = '';

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
}
