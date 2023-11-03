import { ApiProperty } from '@nestjs/swagger';

export class GetDoorDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty()
  openDuration: number;

  @ApiProperty()
  closeDuration: number;

  @ApiProperty({ enum: ['open', 'opening', 'closed', 'closing'] })
  state: 'open' | 'opening' | 'closed' | 'closing';
}
