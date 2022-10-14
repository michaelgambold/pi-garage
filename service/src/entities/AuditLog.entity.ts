import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  QueryOrder,
} from '@mikro-orm/core';

@Entity()
export class AuditLog {
  @PrimaryKey()
  id: number;

  @Property()
  timestamp = new Date();

  @Property()
  detail: string;
}
