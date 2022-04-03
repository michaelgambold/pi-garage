import { ApiProperty } from '@nestjs/swagger';

export class UpdateStateDto {
  @ApiProperty({ enum: ['open', 'close', 'toggle'] })
  state: 'open' | 'close' | 'toggle';
}
