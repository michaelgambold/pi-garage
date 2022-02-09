import { Module } from '@nestjs/common';
import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DoorsModule,
    HealthModule,
    AutomationHatModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
