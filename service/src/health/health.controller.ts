import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { HealthDto } from './dto/health.dto';
import { setTimeout } from 'timers/promises';

@Controller('health')
export class HealthController {
  constructor(private readonly automationHatService: AutomationHatService) {}

  @Get()
  @ApiOperation({ summary: 'Service healthcheck' })
  @ApiOkResponse({ type: HealthDto, example: { message: 'ok' } })
  async getHealth(): Promise<HealthDto> {
    // try to read value from automation hat. we don't care on the value
    // but this should crash if we cannot read it
    this.automationHatService.turnOnCommsLight();
    await setTimeout(50);
    this.automationHatService.turnOffCommsLight();

    return {
      message: 'ok',
    };
  }
}
