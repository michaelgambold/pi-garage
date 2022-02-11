import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AutomationHatModule } from '../automation-hat/automation-hat.module';
import { DoorsController } from './doors.controller';

@Module({
  imports: [AutomationHatModule, AuthModule],
  controllers: [DoorsController],
  providers: [],
})
export class DoorsModule {}
