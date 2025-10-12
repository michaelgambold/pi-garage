import { ApiProperty } from '@nestjs/swagger';
import {
  SequenceObjectAction,
  SequenceObjectTarget,
} from '../entities/SequenceObject.entity';

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

export class OverrideStateDto {
  @ApiProperty({ enum: ['open', 'closed'] })
  state: 'open' | 'closed';
}

export class SequenceObjectDto {
  @ApiProperty({ enum: ['on', 'off', 'low', 'high'] })
  action: SequenceObjectAction;

  @ApiProperty()
  duration: number;

  @ApiProperty({
    enum: [
      'relay1',
      'relay2',
      'relay3',
      'digitalOutput1',
      'digitalOutput2',
      'digitalOutput3',
    ],
  })
  target: SequenceObjectTarget;
}

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

export class UpdateStateDto {
  @ApiProperty({ enum: ['open', 'close', 'toggle'] })
  state: 'open' | 'close' | 'toggle';
}
