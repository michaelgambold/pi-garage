import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { HttpApiKeyAuthGuard } from '../auth/http-api-key-auth.guard';
import { HttpClientVersionGuard } from '../client-version/http-client-version.guard';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogDto } from './dto/audit-log.dto';

@UseGuards(HttpClientVersionGuard, HttpApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('api/v1/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async getAll(): Promise<AuditLogDto[]> {
    const auditLogs = await this.auditLogsService.findAll();

    return auditLogs.map((x) => {
      return { timestamp: x.timestamp, detail: x.detail };
    });
  }
}
