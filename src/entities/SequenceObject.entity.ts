import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Door } from './Door.entity';

export type SequenceObjectAction = 'on' | 'off' | 'low' | 'high';

export type SequenceObjectTarget =
  | 'relay1'
  | 'relay2'
  | 'relay3'
  | 'digitalOutput1'
  | 'digitalOutput2'
  | 'digitalOutput3';
@Entity()
export class SequenceObject {
  @PrimaryKey()
  id!: number;

  @Property()
  index: number;

  @Property()
  action: SequenceObjectAction;

  @Property()
  target: SequenceObjectTarget;

  @Property()
  duration: number;

  @ManyToOne()
  door!: Door;
}
