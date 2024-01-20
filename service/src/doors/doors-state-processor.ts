import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DoorQueue, DoorStateJobName, DoorsStateJobData } from './types';
import { DoorsService } from './doors.service';
import { Logger } from '../logger/logger';
import { MikroORM, CreateRequestContext } from '@mikro-orm/core';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { DoorsGateway } from './doors.gateway';

@Processor(DoorQueue.DOORS_STATE_UPDATE)
export class DoorsStateProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    // don't delete this line it's required so that a clean instance of the orm for
    // each request can be done with the @UseRequestContext
    private readonly orm: MikroORM,
    private readonly doorsService: DoorsService,
    private readonly auditLogService: AuditLogsService,
    private readonly doorsGateway: DoorsGateway,
  ) {
    super();
    this.logger = new Logger(DoorsStateProcessor.name);
  }

  @CreateRequestContext()
  async process(job: Job<DoorsStateJobData, void, string>): Promise<void> {
    this.logger.log(`Processing job ${job.name} for door ${job.data.doorId}`);

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
        return;
    }

    // ensure data is flushed to db
    await this.orm.em.flush();

    await this.auditLogService.create(
      new Date(),
      `Door ${door.id} ${door.state}`,
    );

    // get all doors to emit (in future this might be only one door not all)
    const doors = await this.doorsService.findAll();
    this.doorsGateway.server.emit('doors:list', doors);

    this.logger.log(`Processed job ${job.name} for door ${job.data.doorId}`);
  }
}
