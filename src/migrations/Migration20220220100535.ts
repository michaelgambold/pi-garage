import { Migration } from '@mikro-orm/migrations';

export class Migration20220220100535 extends Migration {

  async up(): Promise<void> {
    this.addSql('PRAGMA foreign_keys = OFF;');
    this.addSql('CREATE TABLE `_knex_temp_alter099` (`id` integer NOT NULL, `label` text NOT NULL, `is_enabled` integer NOT NULL DEFAULT true, `state` text NOT NULL, PRIMARY KEY (`id`));');
    this.addSql('INSERT INTO "_knex_temp_alter099" SELECT * FROM "door";;');
    this.addSql('DROP TABLE "door";');
    this.addSql('ALTER TABLE "_knex_temp_alter099" RENAME TO "door";');
    this.addSql('PRAGMA foreign_keys = ON;');
  }

}
