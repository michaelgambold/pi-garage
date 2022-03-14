import { ApiProperty } from '@nestjs/swagger';

export class GetDoorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty({ enum: ['open', 'closed'] })
  state: 'open' | 'closed';
}
