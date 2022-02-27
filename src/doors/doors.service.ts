import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { DigitalOutputState } from 'automation-hat/dist/io/digital-output';
import { RelayState } from 'automation-hat/dist/io/relay';
import delay from 'delay';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { Door } from '../entities/Door.entity';
import { SequenceObject } from '../entities/SequenceObject.entity';

@Injectable()
export class DoorsService {
  #logger: LoggerService;

  constructor(
    @InjectRepository(Door)
    private readonly doorRepository: EntityRepository<Door>,
    private readonly automationHatService: AutomationHatService,
  ) {
    this.#logger = new ConsoleLogger(DoorsService.name);
  }

  async close(id: number): Promise<void> {
    this.#logger.log(`Closing door ${id}`);
    const door = await this.doorRepository.findOne(
      { id },
      { populate: ['sequence'] },
    );

    for (const sequenceObject of door.sequence) {
      await this.runSequenceObject(sequenceObject);
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
    this.#logger.log(`Opening door ${id}`);
    const door = await this.doorRepository.findOne(
      { id },
      { populate: ['sequence'] },
    );

    for (const sequenceObject of door.sequence) {
      await this.runSequenceObject(sequenceObject);
    }

    // update door state
    door.state = 'open';
    this.update(door);
  }

  private async runSequenceObject(sequenceObject: SequenceObject) {
    let prevState: RelayState | DigitalOutputState;

    this.#logger.log(
      `Setting ${sequenceObject.target} to ${sequenceObject.action}`,
    );

    switch (sequenceObject.target) {
      case 'digitalOutput1':
        prevState =
          this.automationHatService.automationHat.digitalOutputs.output1.state;

        if (sequenceObject.action === 'high') {
          this.automationHatService.automationHat.digitalOutputs.output1.high();
        } else if (sequenceObject.action === 'low') {
          this.automationHatService.automationHat.digitalOutputs.output1.low();
        }
        break;

      case 'digitalOutput2':
        prevState =
          this.automationHatService.automationHat.digitalOutputs.output2.state;

        if (sequenceObject.action === 'high') {
          this.automationHatService.automationHat.digitalOutputs.output2.high();
        } else if (sequenceObject.action === 'low') {
          this.automationHatService.automationHat.digitalOutputs.output2.low();
        }
        break;

      case 'digitalOutput3':
        prevState =
          this.automationHatService.automationHat.digitalOutputs.output3.state;

        if (sequenceObject.action === 'high') {
          this.automationHatService.automationHat.digitalOutputs.output3.high();
        } else if (sequenceObject.action === 'low') {
          this.automationHatService.automationHat.digitalOutputs.output3.low();
        }
        break;

      case 'relay1':
        prevState = this.automationHatService.automationHat.relays.relay1.state;

        if (sequenceObject.action === 'on') {
          this.automationHatService.automationHat.relays.relay1.on();
        } else if (sequenceObject.action === 'off') {
          this.automationHatService.automationHat.relays.relay1.off();
        }
        break;

      case 'relay2':
        prevState = this.automationHatService.automationHat.relays.relay2.state;

        if (sequenceObject.action === 'on') {
          this.automationHatService.automationHat.relays.relay2.on();
        } else if (sequenceObject.action === 'off') {
          this.automationHatService.automationHat.relays.relay2.off();
        }
        break;

      case 'relay3':
        prevState = this.automationHatService.automationHat.relays.relay3.state;

        if (sequenceObject.action === 'on') {
          this.automationHatService.automationHat.relays.relay3.on();
        } else if (sequenceObject.action === 'off') {
          this.automationHatService.automationHat.relays.relay3.off();
        }
        break;
    }

    if (!sequenceObject.duration) return;

    this.#logger.log(`Duration of ${sequenceObject.duration} detected`);

    await delay(sequenceObject.duration);

    this.#logger.log(
      `Setting ${sequenceObject.target} to previous state of ${prevState}`,
    );

    // set back to initial state
    switch (sequenceObject.target) {
      case 'digitalOutput1':
        if (prevState === 'high') {
          this.automationHatService.automationHat.digitalOutputs.output1.high();
        } else if (prevState === 'low') {
          this.automationHatService.automationHat.digitalOutputs.output1.low();
        }
        break;

      case 'digitalOutput2':
        if (prevState === 'high') {
          this.automationHatService.automationHat.digitalOutputs.output2.high();
        } else if (prevState === 'low') {
          this.automationHatService.automationHat.digitalOutputs.output2.low();
        }
        break;

      case 'digitalOutput3':
        if (prevState === 'high') {
          this.automationHatService.automationHat.digitalOutputs.output3.high();
        } else if (prevState === 'low') {
          this.automationHatService.automationHat.digitalOutputs.output3.low();
        }
        break;

      case 'relay1':
        if (prevState === 'on') {
          this.automationHatService.automationHat.relays.relay1.on();
        } else if (prevState === 'off') {
          this.automationHatService.automationHat.relays.relay1.off();
        }
        break;

      case 'relay2':
        if (prevState === 'on') {
          this.automationHatService.automationHat.relays.relay2.on();
        } else if (prevState === 'off') {
          this.automationHatService.automationHat.relays.relay2.off();
        }
        break;

      case 'relay3':
        if (prevState === 'on') {
          this.automationHatService.automationHat.relays.relay3.on();
        } else if (prevState === 'off') {
          this.automationHatService.automationHat.relays.relay3.off();
        }
        break;
    }
  }

  async toggle(id: number): Promise<void> {
    this.#logger.log(`Toggle door ${id}`);
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
