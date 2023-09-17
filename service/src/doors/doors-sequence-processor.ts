import { Processor, WorkerHost } from '@nestjs/bullmq';
import { DoorQueue } from './types';
import { Job } from 'bullmq';
import { ConsoleLogger, LoggerService } from '@nestjs/common';

@Processor(DoorQueue.DOORS_SEQUENCE_RUN)
export class DoorsSequenceProcessor extends WorkerHost {
  #logger: LoggerService;

  constructor() {
    super();
    this.#logger = new ConsoleLogger(DoorsSequenceProcessor.name);
  }

  async process(job: Job<any, any, string>): Promise<any> {
    // push message to change the doors state in x time

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

    console.log(job.name, job.data);
  }
}
