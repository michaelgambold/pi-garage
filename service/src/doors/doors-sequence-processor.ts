import { Processor, WorkerHost } from '@nestjs/bullmq';
import { DoorQueue, DoorsSequenceQueueMessage } from './types';
import { Job } from 'bullmq';
import { ConsoleLogger, LoggerService } from '@nestjs/common';
import { DoorsService } from './doors.service';
import { EntityManager } from '@mikro-orm/sqlite';
// import { Door } from '../entities/Door.entity';
// import { InjectRepository } from '@mikro-orm/nestjs';
import { setTimeout } from 'timers/promises';

@Processor(DoorQueue.DOORS_SEQUENCE_RUN)
export class DoorsSequenceProcessor extends WorkerHost {
  #logger: LoggerService;

  constructor(
    private readonly em: EntityManager,
    private readonly doorsService: DoorsService,
  ) {
    super();
    this.#logger = new ConsoleLogger(DoorsSequenceProcessor.name);
  }

  async process(
    job: Job<DoorsSequenceQueueMessage, void, string>,
  ): Promise<void> {
    // const door = await this.doorsService.findOne(job.data.doorId);
    // console.log(door);

    const context = this.em.fork();

    await context.transactional(async () => {
      const door = await this.doorsService.findOne(job.data.doorId);
      this.#logger.log(JSON.stringify(door));

      // in the future get the door duration from config but for now hard code it
      const duration = 2000;

      // send message to queue to change state of door async or should we do this in the one transaction space?

      switch (job.name) {
        case 'close':
          this.#logger.log('received close door message');
          // await this.doorsService.close(id);
          break;
        case 'open':
          this.#logger.log('received close open message');
          // await this.doorsService.open(id);
          break;
        case 'toggle':
          this.#logger.log('received close toggle message');
          // await this.doorsService.toggle(id);
          break;
        default:
          this.#logger.warn(`Invalid job name: ${job.name}`);
      }

      await setTimeout(duration);
    });

    console.log(job.name, job.data);
  }
}
