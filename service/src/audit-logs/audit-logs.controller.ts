import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogDto } from './dto/audit-log.dto';

@UseGuards(ApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('api/v1/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async findAll(): Promise<AuditLogDto[]> {
    const auditLogs = await this.auditLogsService.findAll();

    return auditLogs.map((x) => {
      return { timestamp: x.timestamp, detail: x.detail };
    });
  }
}
