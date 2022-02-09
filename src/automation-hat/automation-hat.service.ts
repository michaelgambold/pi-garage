import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AutomationHat } from 'automation-hat';

@Injectable()
export class AutomationHatService {
  readonly automationHat: AutomationHat;

  constructor(private readonly configService: ConfigService) {
    this.automationHat = new AutomationHat();

    if (configService.get('LED_BRIGHTNESS')) {
      const value = parseInt(configService.get('LED_BRIGHTNESS'));
      this.automationHat.lights.setLedBrightness(value);
    }

    this.automationHat.lights.enable();
    this.automationHat.relays.enable();
  }
}
