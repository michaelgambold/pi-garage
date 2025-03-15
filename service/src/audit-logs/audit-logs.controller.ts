import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HttpApiKeyAuthGuard } from '../auth/http-api-key-auth.guard';
import { HttpClientVersionGuard } from '../client-version/http-client-version.guard';
import { AuditLogsService } from './audit-logs.service';
import { AuditLogDto } from './dto/audit-log.dto';

@ApiSecurity('api-key')
@ApiTags('audit-logs')
@UseGuards(HttpClientVersionGuard, HttpApiKeyAuthGuard)
@Controller('api/v1/audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @ApiOkResponse({
    type: AuditLogDto,
    isArray: true,
    example: [
      { timestamp: '2025-03-16T10:38:20.000Z', detail: 'Door 1 Open' },
      { timestamp: '2025-03-16T10:38:00.000Z', detail: 'Door 1 Opening' },
    ],
  })
  @Get()
  async getAll(): Promise<AuditLogDto[]> {
    const auditLogs = await this.auditLogsService.findAll();

    return auditLogs.map((x) => {
      return { timestamp: x.timestamp, detail: x.detail };
    });
  }
}
