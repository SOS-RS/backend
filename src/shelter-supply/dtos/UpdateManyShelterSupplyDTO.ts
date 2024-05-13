import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateManyShelterSupplySchemaDTO {
  @ApiProperty({
    type: [String],
    example: ['ID do Suprimento', 'ID do Suprimento 2'],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @IsString({ each: true })
  readonly ids!: string;
}
