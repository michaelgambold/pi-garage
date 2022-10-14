import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { ConsoleLogger, Injectable, LoggerService } from '@nestjs/common';
import { AuditLog } from '../entities/AuditLog.entity';

@Injectable()
export class AuditLogsService {
  #logger: LoggerService;

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: EntityRepository<AuditLog>,
  ) {
    this.#logger = new ConsoleLogger(AuditLogsService.name);
  }

  findAll() {
    return this.auditLogRepository.findAll({
      orderBy: { timestamp: 'DESC' },
      limit: 100,
    });
  }
}
