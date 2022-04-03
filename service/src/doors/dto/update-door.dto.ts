import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoorDto {
  @ApiProperty()
  label: string;

  @ApiProperty()
  isEnabled: boolean;
}
