import { Migration } from '@mikro-orm/migrations';

export class Migration20220626082351 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `door` add column `updated_at` datetime not null;');
  }

}
