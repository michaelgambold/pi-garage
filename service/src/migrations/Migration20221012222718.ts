import { Migration } from '@mikro-orm/migrations';

export class Migration20221012222718 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `audit_log` (`id` integer not null primary key autoincrement, `timestamp` datetime not null, `detail` text not null);');
  }

}
