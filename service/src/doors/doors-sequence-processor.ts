import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { DoorQueue, DoorSequenceJobName, DoorsSequenceJobData } from './types';
import { DoorsService } from './doors.service';
import { Logger } from '../logger/logger';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { AutomationHatService } from '../automation-hat/automation-hat.service';

@Processor(DoorQueue.DOORS_SEQUENCE_RUN)
export class DoorsSequenceProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    // don't delete this line it's required so that a clean instance of the orm for
    // each request can be done with the @UseRequestContext
    private readonly orm: MikroORM,
    private readonly doorsService: DoorsService,
    private readonly automationHatService: AutomationHatService,
  ) {
    super();
    this.logger = new Logger(DoorsSequenceProcessor.name);
  }

  @UseRequestContext()
  async process(job: Job<DoorsSequenceJobData, void, string>): Promise<void> {
    this.logger.log(`Processing job ${job.name} for door ${job.data.doorId}`);

    switch (job.name) {
      case DoorSequenceJobName.OPEN:
        await this.open(job.data);
        break;

      case DoorSequenceJobName.CLOSE:
        await this.close(job.data);
        break;

      default:
        this.logger.warn(`Job name ${job.name} not supported`);
        break;
    }

    this.logger.log(`Processed job ${job.name} for door ${job.data.doorId}`);
  }

  private async close(data: DoorsSequenceJobData): Promise<void> {
    const door = await this.doorsService.findOne(data.doorId);

    this.logger.log(`Running sequence for door ${data.doorId}`);

    for (const sequenceObject of door.sequence) {
      await this.automationHatService.runSequenceObject(sequenceObject);
    }

    this.logger.log(`Ran sequence for door ${data.doorId}`);
  }

  private async open(data: DoorsSequenceJobData): Promise<void> {
    const door = await this.doorsService.findOne(data.doorId);

    this.logger.log(`Running sequence for door ${data.doorId}`);

    for (const sequenceObject of door.sequence) {
      await this.automationHatService.runSequenceObject(sequenceObject);
    }

    this.logger.log(`Ran sequence for door ${data.doorId}`);
  }
}
