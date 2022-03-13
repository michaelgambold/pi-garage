import { ConsoleLogger, Controller, Get, LoggerService } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import delay from 'delay';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { HealthDto } from './dto/health.dto';

@Controller('health')
export class HealthController {
  #logger: LoggerService;

  constructor(private readonly automationHatService: AutomationHatService) {
    this.#logger = new ConsoleLogger(HealthController.name);
  }

  @Get()
  @ApiResponse({ type: HealthDto })
  async getHealth(): Promise<HealthDto> {
    this.#logger.log('GET /health invoked');

    // try to read value from automation hat. we don't care on the value
    // but this should crash if we cannot read it
    this.automationHatService.turnOnCommsLight();
    await delay(50);
    this.automationHatService.turnOffCommsLight();

    return {
      message: 'ok',
    };
  }
}
