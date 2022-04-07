import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AutomationHatModule } from '../automation-hat/automation-hat.module';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';
import { Door } from '../entities/Door.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Door]), AutomationHatModule, AuthModule],
  controllers: [DoorsController],
  providers: [DoorsService],
})
export class DoorsModule {}
