import { ApiProperty } from '@nestjs/swagger';

/**
 * Classe utilizada apenas para fins de documentação do swagger
 */
export class FileDtoStub {
  @ApiProperty({ type: 'string', format: 'binary' })
  file?: string;
}
