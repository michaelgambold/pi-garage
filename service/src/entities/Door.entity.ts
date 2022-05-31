import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { SequenceObject } from './SequenceObject.entity';

@Entity()
export class Door {
  @PrimaryKey()
  id: number;

  @Property()
  label: string;

  @Property({ default: true })
  isEnabled: boolean;

  @Property()
  state: 'open' | 'opening' | 'closed' | 'closing';

  @OneToMany(() => SequenceObject, (sequenceObject) => sequenceObject.door, {
    orderBy: { index: QueryOrder.ASC },
    orphanRemoval: true,
  })
  sequence = new Collection<SequenceObject>(this);
}
