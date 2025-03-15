import { ApiProperty } from '@nestjs/swagger';

export class AuditLogDto {
  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  detail: string;
}
