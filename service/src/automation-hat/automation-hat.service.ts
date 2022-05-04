import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AutomationHat } from 'automation-hat';
import { DigitalOutputState } from 'automation-hat/dist/io/digital-output';
import { RelayState } from 'automation-hat/dist/io/relay';
import delay from 'delay';
import { SequenceObject } from 'src/entities/SequenceObject.entity';

@Injectable()
export class AutomationHatService {
  readonly #automationHat: AutomationHat;
  readonly #logger: LoggerService;

  constructor(private readonly configService: ConfigService) {
    this.#logger = new ConsoleLogger(AutomationHatService.name);
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
    let prevState: RelayState | DigitalOutputState;

    this.#logger.log(
      `Setting ${sequenceObject.target} to ${sequenceObject.action}`,
    );

    switch (sequenceObject.target) {
      case 'digitalOutput1':
        prevState = this.#automationHat.digitalOutputs.output1.state;

        if (sequenceObject.action === 'high') {
          this.#automationHat.digitalOutputs.output1.high();
        } else if (sequenceObject.action === 'low') {
          this.#automationHat.digitalOutputs.output1.low();
        }
        break;

      case 'digitalOutput2':
        prevState = this.#automationHat.digitalOutputs.output2.state;

        if (sequenceObject.action === 'high') {
          this.#automationHat.digitalOutputs.output2.high();
        } else if (sequenceObject.action === 'low') {
          this.#automationHat.digitalOutputs.output2.low();
        }
        break;

      case 'digitalOutput3':
        prevState = this.#automationHat.digitalOutputs.output3.state;

        if (sequenceObject.action === 'high') {
          this.#automationHat.digitalOutputs.output3.high();
        } else if (sequenceObject.action === 'low') {
          this.#automationHat.digitalOutputs.output3.low();
        }
        break;

      case 'relay1':
        prevState = this.#automationHat.relays.relay1.state;

        if (sequenceObject.action === 'on') {
          this.#automationHat.relays.relay1.on();
        } else if (sequenceObject.action === 'off') {
          this.#automationHat.relays.relay1.off();
        }
        break;

      case 'relay2':
        prevState = this.#automationHat.relays.relay2.state;

        if (sequenceObject.action === 'on') {
          this.#automationHat.relays.relay2.on();
        } else if (sequenceObject.action === 'off') {
          this.#automationHat.relays.relay2.off();
        }
        break;

      case 'relay3':
        prevState = this.#automationHat.relays.relay3.state;

        if (sequenceObject.action === 'on') {
          this.#automationHat.relays.relay3.on();
        } else if (sequenceObject.action === 'off') {
          this.#automationHat.relays.relay3.off();
        }
        break;
    }

    if (!sequenceObject.duration) {
      // add a safety delay to try and prevent relay lockups
      await delay(20);
      return;
    }

    this.#logger.log(`Duration of ${sequenceObject.duration} detected`);

    await delay(sequenceObject.duration);

    this.#logger.log(
      `Setting ${sequenceObject.target} to previous state of ${prevState}`,
    );

    // set back to initial state
    switch (sequenceObject.target) {
      case 'digitalOutput1':
        if (prevState === 'high') {
          this.#automationHat.digitalOutputs.output1.high();
        } else if (prevState === 'low') {
          this.#automationHat.digitalOutputs.output1.low();
        }
        break;

      case 'digitalOutput2':
        if (prevState === 'high') {
          this.#automationHat.digitalOutputs.output2.high();
        } else if (prevState === 'low') {
          this.#automationHat.digitalOutputs.output2.low();
        }
        break;

      case 'digitalOutput3':
        if (prevState === 'high') {
          this.#automationHat.digitalOutputs.output3.high();
        } else if (prevState === 'low') {
          this.#automationHat.digitalOutputs.output3.low();
        }
        break;

      case 'relay1':
        if (prevState === 'on') {
          this.#automationHat.relays.relay1.on();
        } else if (prevState === 'off') {
          this.#automationHat.relays.relay1.off();
        }
        break;

      case 'relay2':
        if (prevState === 'on') {
          this.#automationHat.relays.relay2.on();
        } else if (prevState === 'off') {
          this.#automationHat.relays.relay2.off();
        }
        break;

      case 'relay3':
        if (prevState === 'on') {
          this.#automationHat.relays.relay3.on();
        } else if (prevState === 'off') {
          this.#automationHat.relays.relay3.off();
        }
        break;
    }

    // add a safety delay to try and prevent relay lockups
    await delay(20);
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
