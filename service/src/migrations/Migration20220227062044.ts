import { Migration } from '@mikro-orm/migrations';

export class Migration20220227062044 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `door` (`id` integer not null primary key autoincrement, `label` text not null, `is_enabled` integer not null default true, `state` text not null);');

    this.addSql('create table `sequence_object` (`id` integer not null primary key autoincrement, `index` integer not null, `action` text not null, `target` text not null, `duration` integer not null, `door_id` integer not null, constraint `sequence_object_door_id_foreign` foreign key(`door_id`) references `door`(`id`) on update cascade);');
    this.addSql('create index `sequence_object_door_id_index` on `sequence_object` (`door_id`);');
  }

}
