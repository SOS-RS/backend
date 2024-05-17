import { ApiProperty } from '@nestjs/swagger';

export class FileDtoStub {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  file?: string;
  @ApiProperty({ required: false })
  csvUrl?: string;
}
