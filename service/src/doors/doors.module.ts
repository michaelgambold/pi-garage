import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AutomationHatModule } from '../automation-hat/automation-hat.module';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';
import { Door } from '../entities/Door.entity';
import { AuditLog } from '../entities/AuditLog.entity';
import { DoorsGateway } from './doors.gateway';

@Module({
  imports: [
    MikroOrmModule.forFeature([Door, AuditLog]),
    AutomationHatModule,
    AuthModule,
  ],
  controllers: [DoorsController],
  providers: [DoorsService, DoorsGateway],
})
export class DoorsModule {}
