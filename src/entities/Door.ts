import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';
import { Sequence } from './Sequence';

@Entity()
export class Door {
  @PrimaryKey({ autoincrement: false })
  id: number;

  @Property()
  label: string;

  @Property({ default: true })
  isEnabled: boolean;

  @Property()
  state: 'open' | 'closed';

  @OneToMany(() => Sequence, (sequence) => sequence.door, {
    orderBy: { index: QueryOrder.ASC },
  })
  sequences = new Collection<Sequence>(this);
}
