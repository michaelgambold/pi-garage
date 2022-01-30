import { Controller, Get, Post } from '@nestjs/common';
import { AutomationHat } from 'automation-hat';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private ah: AutomationHat;

  constructor(private readonly appService: AppService) {
    this.ah = new AutomationHat();
    this.ah.lights.enable();
    this.ah.relays.enable();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('test')
  update(): void {
    this.ah.relays.relay1.toggle();
  }
}
