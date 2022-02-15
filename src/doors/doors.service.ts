import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { Door } from '../entities/Door';

@Injectable()
export class DoorsService {
  constructor(
    @InjectRepository(Door)
    private readonly doorRepository: EntityRepository<Door>,
    private readonly automationHatService: AutomationHatService,
  ) {}

  async close(id: number): Promise<void> {
    const door = await this.findOne(id);

    // get sequence
    // execute sequence
    switch (id) {
      case 1:
        this.automationHatService.automationHat.relays.relay1.toggle();
        break;
      case 2:
        this.automationHatService.automationHat.relays.relay2.toggle();
        break;
      case 3:
        this.automationHatService.automationHat.relays.relay3.toggle();
        break;
    }

    // update door state
    door.state = 'closed';
    this.update(door);
  }

  findAll() {
    return this.doorRepository.findAll();
  }

  findOne(id: number) {
    return this.doorRepository.findOne({ id });
  }

  async open(id: number): Promise<void> {
    const door = await this.findOne(id);

    // perform sequences
    switch (id) {
      case 1:
        this.automationHatService.automationHat.relays.relay1.toggle();
        break;
      case 2:
        this.automationHatService.automationHat.relays.relay2.toggle();
        break;
      case 3:
        this.automationHatService.automationHat.relays.relay3.toggle();
        break;
    }

    // update door state
    door.state = 'open';
    this.update(door);
  }

  async toggle(id: number): Promise<void> {
    const door = await this.findOne(id);

    if (door.state === 'closed') {
      await this.open(door.id);
      return;
    }

    await this.close(door.id);
  }

  async update(door: Door): Promise<void> {
    await this.doorRepository.persistAndFlush(door);
  }
}
