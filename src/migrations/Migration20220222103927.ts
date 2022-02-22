import { Migration } from '@mikro-orm/migrations';

export class Migration20220222103927 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `door` (`id` integer not null, `label` text not null, `is_enabled` integer not null default true, `state` text not null, primary key (`id`));');

    this.addSql('create table `sequence` (`id` integer not null primary key autoincrement, `index` integer not null, `action` text not null, `target` text not null, `duration` integer not null, `door_id` integer not null, constraint `sequence_door_id_foreign` foreign key(`door_id`) references `door`(`id`) on update cascade);');
    this.addSql('create index `sequence_door_id_index` on `sequence` (`door_id`);');
  }

}
