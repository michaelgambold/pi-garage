import { ApiProperty } from '@nestjs/swagger';
import {
  SequenceObjectAction,
  SequenceObjectTarget,
} from '../../entities/SequenceObject.entity';

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
