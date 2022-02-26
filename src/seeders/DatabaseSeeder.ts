import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Door } from '../entities/Door.entity';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const door1 = await em.findOne(Door, 1);

    if (!door1) {
      em.create(Door, {
        id: 1,
        label: `Door 1`,
        isEnabled: true,
        state: 'closed',
        sequences: [
          {
            action: 'on',
            door: 1,
            duration: 1000,
            index: 1,
            target: 'relay1',
          },
        ],
      });
    }

    const door2 = await em.findOne(Door, 2);

    if (!door2) {
      em.create(Door, {
        id: 2,
        label: `Door 2`,
        isEnabled: true,
        state: 'closed',
        sequences: [
          {
            action: 'on',
            door: 2,
            duration: 1000,
            index: 1,
            target: 'relay2',
          },
        ],
      });
    }

    const door3 = await em.findOne(Door, 3);

    if (!door3) {
      em.create(Door, {
        id: 3,
        label: `Door 3`,
        isEnabled: true,
        state: 'closed',
        sequences: [
          {
            action: 'on',
            door: 3,
            duration: 1000,
            index: 1,
            target: 'relay3',
          },
        ],
      });
    }
  }
}
