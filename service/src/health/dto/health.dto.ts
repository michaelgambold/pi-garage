import { ApiProperty } from '@nestjs/swagger';

export class HealthDto {
  @ApiProperty()
  message: string;
}
