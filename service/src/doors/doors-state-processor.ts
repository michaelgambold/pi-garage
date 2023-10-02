import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DoorQueue, DoorStateJobName, DoorsStateJobData } from './types';
import { DoorsService } from './doors.service';
import { Logger } from '../logger/logger';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

@Processor(DoorQueue.DOORS_STATE_UPDATE)
export class DoorsStateProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    // don't delete this line it's required so that a clean instance of the orm for
    // each request can be done with the @UseRequestContext
    private readonly orm: MikroORM,
    private readonly doorsService: DoorsService,
    private readonly auditLogService: AuditLogsService,
  ) {
    super();
    this.logger = new Logger(DoorsStateProcessor.name);
  }

  @UseRequestContext()
  async process(job: Job<DoorsStateJobData, void, string>): Promise<void> {
    const door = await this.doorsService.findOne(job.data.doorId);

    switch (job.name) {
      case DoorStateJobName.CLOSED:
        door.state = 'closed';
        break;

      case DoorStateJobName.CLOSING:
        door.state = 'closing';
        break;

      case DoorStateJobName.OPEN:
        door.state = 'open';
        break;

      case DoorStateJobName.OPENING:
        door.state = 'opening';
        break;

      default:
        this.logger.warn(`Job name ${job.name} not supported`);
        break;
    }

    this.orm.em.flush();
  }
}
