import { IsOptional, IsString, IsNumber, IsIn, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupplyPriority } from 'src/supply/types';
import { Transform } from 'class-transformer';

export class ShelterQueryDTO {
  @ApiProperty({
    required: false,
    description: 'Quantidade de resultados por página',
  })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  perPage?: number;

  @ApiProperty({ required: false, description: 'Número da página' })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  page?: number;

  @ApiProperty({ required: false, description: 'Termo de busca' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Ordem dos resultados',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiProperty({
    required: false,
    description: 'Critério de ordenação dos resultados',
  })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiProperty({
    required: false,
    description: 'IDs de categoria de suprimento',
  })
  @IsOptional()
  @IsString({ each: true })
  supplyCategoryIds?: string[];

  @ApiProperty({
    required: false,
    description: 'Prioridade de suprimento',
    enum: SupplyPriority,
  })
  @IsOptional()
  @IsEnum(SupplyPriority)
  @Transform((value) => Number(value.value))
  priority?: SupplyPriority;

  @ApiProperty({ required: false, description: 'IDs de suprimento' })
  @IsOptional()
  @IsString({ each: true })
  supplyIds?: string[];

  @ApiProperty({
    required: false,
    description: 'Status do abrigo',
  })
  @IsOptional()
  @IsIn(['available', 'unavailable', 'waiting'], { each: true })
  shelterStatus?: ('available' | 'unavailable' | 'waiting')[]; // MUDAR !!!!
}
