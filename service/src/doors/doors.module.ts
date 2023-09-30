import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '../auth/auth.module';
import { AutomationHatModule } from '../automation-hat/automation-hat.module';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';
import { Door } from '../entities/Door.entity';
import { AuditLog } from '../entities/AuditLog.entity';
import { DoorsGateway } from './doors.gateway';
import { ClientVersionModule } from '../client-version/client-version.module';
import { DoorsSequenceProcessor } from './doors-sequence-processor';
import { DoorQueue } from './types';
import { DoorsStateProcessor } from './doors-state-processor';

@Module({
  imports: [
    MikroOrmModule.forFeature([Door, AuditLog]),
    BullModule.registerQueue({
      name: DoorQueue.DOORS_SEQUENCE_RUN,
    }),
    BullModule.registerQueue({
      name: DoorQueue.DOORS_STATE_UPDATE,
    }),
    AutomationHatModule,
    AuthModule,
    ClientVersionModule,
  ],
  controllers: [DoorsController],
  providers: [
    DoorsService,
    DoorsGateway,
    DoorsSequenceProcessor,
    DoorsStateProcessor,
  ],
})
export class DoorsModule {}
