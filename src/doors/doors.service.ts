import { Injectable } from '@nestjs/common';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { Door } from './models/door';

@Injectable()
export class DoorsService {
  readonly door1: Door;
  readonly door2: Door;
  readonly door3: Door;

  constructor(private readonly automationHatService: AutomationHatService) {
    this.door1 = new Door();
    this.door2 = new Door();
    this.door3 = new Door();
  }

  private close(door: Door): void {
    // get sequence
    // execute sequence
  }

  private open(door: Door): void {
    // get sequence
    // execute sequence
  }

  update(doorNumber, action: 'open' | 'close' | 'toggle') {
    let door: Door;

    switch (doorNumber) {
      case 1:
        door = this.door1;
        this.automationHatService.automationHat.relays.relay1.toggle();
        break;
      case 2:
        door = this.door2;
        this.automationHatService.automationHat.relays.relay2.toggle();
        break;
      case 3:
        door = this.door3;
        this.automationHatService.automationHat.relays.relay3.toggle();
        break;
      default:
        throw Error('Invalid door number');
    }

    switch (action) {
      case 'close':
        this.close(door);
        break;
      case 'open':
        this.open(door);
        break;
      case 'toggle':
        if (door.state === 'closed') this.open(door);
        if (door.state === 'open') this.close(door);
        break;
    }
  }
}
