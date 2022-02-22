import { ConsoleLogger, Controller, Get, LoggerService } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
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
  getHealth(): HealthDto {
    this.#logger.log('GET /health invoked');

    // try to read value from automation hat. we don't care on the value
    // but this should crash if we cannot read it
    this.automationHatService.automationHat.relays.relay1.state;

    return {
      message: 'ok',
    };
  }
}
