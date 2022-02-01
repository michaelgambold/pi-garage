import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { HealthDto } from './dto/health.dto';

@Controller('health')
export class HealthController {
  constructor(private readonly automationHatService: AutomationHatService) {}

  @Get()
  @ApiResponse({ type: HealthDto })
  getHealth(): HealthDto {
    // try to read value from automation hat. we don't care on the value
    // but this should crash if we cannot read it
    this.automationHatService.automationHat.relays.relay1.state;

    return {
      message: 'ok',
    };
  }
}
