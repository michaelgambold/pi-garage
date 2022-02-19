import { Module } from '@nestjs/common';
import { DoorsModule } from './doors/doors.module';
import { HealthModule } from './health/health.module';
import { AutomationHatModule } from './automation-hat/automation-hat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(),
    DoorsModule,
    HealthModule,
    AutomationHatModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
