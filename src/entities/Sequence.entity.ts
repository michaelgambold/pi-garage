import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Door } from './Door.entity';

@Entity()
export class Sequence {
  @PrimaryKey()
  id!: number;

  @Property()
  index: number;

  @Property()
  action: 'on' | 'off' | 'low' | 'high';

  @Property()
  target:
    | 'relay1'
    | 'relay2'
    | 'relay3'
    | 'digitalOutput1'
    | 'digitalOutput2'
    | 'digitalOutput3';

  @Property()
  duration: number;

  @ManyToOne()
  door!: Door;
}
