import { Module } from '@nestjs/common';
import { AutomationHatModule } from '../automation-hat/automation-hat.module';
import { HealthController } from './health.controller';

@Module({
  imports: [AutomationHatModule],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
