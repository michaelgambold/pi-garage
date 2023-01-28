import { Module } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogsController } from './audit-logs.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuditLog } from '../entities/AuditLog.entity';
import { AuthModule } from '../auth/auth.module';
import { ClientVersionModule } from '../client-version/client-version.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([AuditLog]),
    AuthModule,
    ClientVersionModule,
  ],
  controllers: [AuditLogsController],
  providers: [AuditLogsService],
  exports: [AuditLogsService],
})
export class AuditLogsModule {}
