import { Module } from '@nestjs/common';
import { AutomationHatModule } from '../automation-hat/automation-hat.module';
import { DoorsController } from './doors.controller';

@Module({
  imports: [AutomationHatModule],
  controllers: [DoorsController],
  providers: [],
})
export class DoorsModule {}
