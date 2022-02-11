import { Module } from '@nestjs/common';
import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DoorsModule,
    HealthModule,
    AutomationHatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
