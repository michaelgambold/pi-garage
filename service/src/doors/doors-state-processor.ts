import { Processor, WorkerHost } from '@nestjs/bullmq';
import { EntityManager } from '@mikro-orm/sqlite';
import { Job } from 'bullmq';
import { DoorQueue, DoorsSequenceQueueMessage } from './types';
import { DoorsService } from './doors.service';
import { Logger } from '../logger/logger';
import { UseRequestContext } from '@mikro-orm/core';
// import { Door } from '../entities/Door.entity';
// import { InjectRepository } from '@mikro-orm/nestjs';

@Processor(DoorQueue.DOORS_STATE_UPDATE)
export class DoorsStateProcessor extends WorkerHost {
  private readonly logger: Logger;

  constructor(
    private readonly em: EntityManager,
    private readonly doorsService: DoorsService,
  ) {
    super();
    this.logger = new Logger(DoorsStateProcessor.name);
  }

  // @UseRequestContext()
  async process(
    job: Job<DoorsSequenceQueueMessage, void, string>,
  ): Promise<void> {
    // const door = await this.doorsService.findOne(job.data.doorId);
    // console.log(door);
    this.logger.log("I'M IN THE DOOR STATE PROCESSOR");

    this.logger.log(job);

    // const door = this.doorsService.findOne(1);
    // console.log(door);

    //   const context = this.em.fork();

    //   await context.transactional(async () => {
    //     const door = await this.doorsService.findOne(job.data.doorId);
    //     this.logger.log(JSON.stringify(door));

    //     // in the future get the door duration from config but for now hard code it
    //     const duration = 2000;

    //     // send message to queue to change state of door async or should we do this in the one transaction space?

    //     switch (job.name) {
    //       case 'close':
    //         this.logger.log('received close door message');
    //         // await this.doorsService.close(id);
    //         break;
    //       case 'open':
    //         this.logger.log('received close open message');
    //         // await this.doorsService.open(id);
    //         break;
    //       case 'toggle':
    //         this.logger.log('received close toggle message');
    //         // await this.doorsService.toggle(id);
    //         break;
    //       default:
    //         this.logger.warn(`Invalid job name: ${job.name}`);
    //     }

    //     await setTimeout(duration);
    //   });

    //   console.log(job.name, job.data);
  }
}
