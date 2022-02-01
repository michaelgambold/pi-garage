import { Module } from '@nestjs/common';
import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';

@Module({
  imports: [DoorsModule, HealthModule, AutomationHatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
