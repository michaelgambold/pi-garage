import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AutomationHat } from 'automation-hat';
import { setTimeout } from 'timers/promises';
import { SequenceObject } from 'src/entities/SequenceObject.entity';
import { Logger } from '../logger/logger';

@Injectable()
export class AutomationHatService {
  readonly #automationHat: AutomationHat;
  readonly #logger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.#logger = new Logger(AutomationHatService.name);
    this.#logger.log('Initializing automation hat');
    this.#automationHat = new AutomationHat();

    if (configService.get('LED_BRIGHTNESS')) {
      const value = parseInt(configService.get('LED_BRIGHTNESS'));
      this.#logger.log(`Setting brightness to ${value}`);
      this.#automationHat.lights.setLedBrightness(value);
    }

    this.#automationHat.lights.enable();
    this.#automationHat.relays.enable();

    this.#logger.log('Automation hat initalization complete');
  }

  async runSequenceObject(sequenceObject: SequenceObject) {
    this.#logger.log(
      `Setting ${sequenceObject.target} to ${sequenceObject.action}`,
    );

    switch (sequenceObject.target) {
      case 'digitalOutput1':
        if (sequenceObject.action === 'high') {
          this.#automationHat.digitalOutputs.output1.high();
        } else if (sequenceObject.action === 'low') {
          this.#automationHat.digitalOutputs.output1.low();
        }
        break;

      case 'digitalOutput2':
        if (sequenceObject.action === 'high') {
          this.#automationHat.digitalOutputs.output2.high();
        } else if (sequenceObject.action === 'low') {
          this.#automationHat.digitalOutputs.output2.low();
        }
        break;

      case 'digitalOutput3':
        if (sequenceObject.action === 'high') {
          this.#automationHat.digitalOutputs.output3.high();
        } else if (sequenceObject.action === 'low') {
          this.#automationHat.digitalOutputs.output3.low();
        }
        break;

      case 'relay1':
        if (sequenceObject.action === 'on') {
          this.#automationHat.relays.relay1.on();
        } else if (sequenceObject.action === 'off') {
          this.#automationHat.relays.relay1.off();
        }
        break;

      case 'relay2':
        if (sequenceObject.action === 'on') {
          this.#automationHat.relays.relay2.on();
        } else if (sequenceObject.action === 'off') {
          this.#automationHat.relays.relay2.off();
        }
        break;

      case 'relay3':
        if (sequenceObject.action === 'on') {
          this.#automationHat.relays.relay3.on();
        } else if (sequenceObject.action === 'off') {
          this.#automationHat.relays.relay3.off();
        }
        break;
    }

    await setTimeout(sequenceObject.duration);
  }

  turnOffCommsLight() {
    this.#automationHat.lights.comms.off();
    this.#automationHat.lights.update();
  }

  turnOnCommsLight() {
    this.#automationHat.lights.comms.on();
    this.#automationHat.lights.update();
  }
}
