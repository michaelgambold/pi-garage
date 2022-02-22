import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AutomationHat } from 'automation-hat';

@Injectable()
export class AutomationHatService {
  public get automationHat(): AutomationHat {
    return this.#automationHat;
  }

  readonly #automationHat: AutomationHat;
  readonly #logger: LoggerService;

  constructor(private readonly configService: ConfigService) {
    this.#logger = new ConsoleLogger(AutomationHatService.name);
    this.#logger.log('Initializing automation hat');
    this.#automationHat = new AutomationHat();

    if (configService.get('LED_BRIGHTNESS')) {
      const value = parseInt(configService.get('LED_BRIGHTNESS'));
      this.#logger.log(`Setting brightness to ${value}`);
      this.automationHat.lights.setLedBrightness(value);
    }

    this.automationHat.lights.enable();
    this.automationHat.relays.enable();

    this.#logger.log('Automation hat initalization complete');
  }
}
