import { Injectable } from '@nestjs/common';
import { AutomationHat } from 'automation-hat';

@Injectable()
export class AutomationHatService {
  readonly automationHat: AutomationHat;

  constructor() {
    this.automationHat = new AutomationHat();
    this.automationHat.lights.enable();
    this.automationHat.relays.enable();
  }
}
