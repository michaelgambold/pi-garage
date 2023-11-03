import { Migration } from '@mikro-orm/migrations';

export class Migration20231103104030 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `door` add column `open_duration` integer not null default 20000;');
    this.addSql('alter table `door` add column `close_duration` integer not null default 20000;');
  }

}
