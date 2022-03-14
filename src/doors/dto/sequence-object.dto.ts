import { ApiProperty } from '@nestjs/swagger';
import {
  SequenceObjectAction,
  SequenceObjectTarget,
} from '../../entities/SequenceObject.entity';

export class SequenceObjectDto {
  @ApiProperty()
  action: SequenceObjectAction;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  target: SequenceObjectTarget;
}
