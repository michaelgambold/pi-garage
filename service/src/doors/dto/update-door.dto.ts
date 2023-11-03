import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoorDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty()
  openDuration: number;

  @ApiProperty()
  closeDuration: number;
}
