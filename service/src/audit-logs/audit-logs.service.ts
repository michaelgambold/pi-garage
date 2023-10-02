import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { AuditLog } from '../entities/AuditLog.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: EntityRepository<AuditLog>,
  ) {}

  async create(timestamp: Date, detail: string) {
    const auditLog = this.auditLogRepository.create({
      timestamp,
      detail,
    });

    await this.auditLogRepository.getEntityManager().persistAndFlush(auditLog);

    return auditLog;
  }

  findAll() {
    return this.auditLogRepository.findAll({
      orderBy: { timestamp: 'DESC' },
      limit: 100,
    });
  }
}
