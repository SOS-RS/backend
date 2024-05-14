import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SupplyPriority } from 'src/supply/types';
import { Transform } from 'class-transformer';
import { ShelterStatus } from '../types/search.types';

export class ShelterQueryDTO {
  @ApiProperty({
    required: false,
    description: 'Quantidade de resultados por página',
  })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  readonly perPage?: number;

  @ApiProperty({ required: false, description: 'Número da página' })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  readonly page?: number;

  @ApiProperty({ required: false, description: 'Termo de busca' })
  @IsOptional()
  @IsString()
  readonly search?: string;

  @ApiProperty({
    required: false,
    description: 'Ordem dos resultados',
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  readonly order?: 'asc' | 'desc';

  @ApiProperty({
    required: false,
    description: 'Critério de ordenação dos resultados',
  })
  @IsOptional()
  @IsString()
  readonly orderBy?: string;

  @ApiProperty({
    required: false,
    description: 'IDs de categoria de suprimento',
  })
  @IsOptional()
  @IsString({ each: true })
  readonly supplyCategoryIds?: string[];

  @ApiProperty({
    required: false,
    description: 'Prioridade de suprimento',
    enum: SupplyPriority,
  })
  @IsOptional()
  @IsEnum(SupplyPriority)
  @Transform((value) => Number(value.value))
  readonly priority?: SupplyPriority;

  @ApiProperty({ required: false, description: 'IDs de suprimento' })
  @IsOptional()
  @IsString({ each: true })
  readonly supplyIds?: string[];

  @ApiProperty({
    required: false,
    description: 'Status do abrigo',
  })
  @IsOptional()
  @IsIn(['available', 'unavailable', 'waiting'], { each: true })
  readonly shelterStatus?: ShelterStatus[];

  @ApiProperty({
    required: false,
    description: 'Informação sobre tags do abrigo',
  })
  @IsOptional()
  @ValidateNested()
  readonly tags?: Record<
    'NeedVolunteers' | 'NeedDonations' | 'RemainingSupplies',
    number | undefined
  >;

  @ApiProperty({ required: false, description: 'Lista de cidades' })
  @IsOptional()
  @IsString({ each: true })
  readonly cities?: string[];

  @ApiProperty({
    required: false,
    description: 'Latitude',
  })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  readonly latitude?: number;

  @ApiProperty({
    required: false,
    description: 'Longitude',
  })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  readonly longitude?: number;

  @ApiProperty({
    required: false,
    description: 'Raio em metros',
  })
  @IsOptional()
  @IsNumber()
  @Transform((value) => Number(value.value))
  readonly radiusInMeters?: number;
}
