import { ApiProperty } from '@nestjs/swagger';

export class SupplyCategoriesDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: string = new Date().toISOString();

  @ApiProperty()
  updateAt: string = new Date().toISOString();
}
