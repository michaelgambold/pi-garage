import { Module } from '@nestjs/common';
import { AutomationHatService } from './automation-hat.service';

@Module({
  providers: [AutomationHatService],
  exports: [AutomationHatService],
})
export class AutomationHatModule {}
