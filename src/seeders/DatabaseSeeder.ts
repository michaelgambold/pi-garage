import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Door } from '../entities/Door.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const ids = [1, 2, 3];

    for (const id of ids) {
      // check if record exists already
      const existingDoor = await em.findOne(Door, id);

      if (existingDoor) continue;

      em.create(Door, {
        id,
        label: `Door ${id}`,
        isEnabled: true,
        state: 'closed',
        sequences: [
          {
            action: 'on',
            door: id,
            duration: 1000,
            index: 1,
            target: 'relay1',
          },
        ],
      });
    }
  }
}
