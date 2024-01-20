import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/sqlite';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Door } from '../entities/Door.entity';
import { DoorsGateway } from './doors.gateway';
import { Logger } from '../logger/logger';

@Injectable()
export class DoorsService {
  private readonly logger: Logger;

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Door)
    private readonly doorRepository: EntityRepository<Door>,
    @Inject(forwardRef(() => DoorsGateway))
    private readonly doorsGateway: DoorsGateway,
  ) {
    this.logger = new Logger(DoorsService.name);
  }

  // async close(id: number): Promise<void> {
  //   this.logger.log(`Closing door ${id}`);

  //   // get door with sequence
  //   const door = await this.doorRepository.findOne(
  //     { id },
  //     { populate: ['sequence'] },
  //   );

  //   door.state = 'closing';
  //   await this.update(door);

  //   for (const sequenceObject of door.sequence) {
  //     await this.automationHatService.runSequenceObject(sequenceObject);
  //   }

  //   door.state = 'closed';
  //   await this.update(door);

  //   const auditLog = this.auditLogRepository.create({
  //     detail: `Door ${door.id} ${door.state}`,
  //   });
  //   await this.auditLogRepository.persistAndFlush(auditLog);
  // }

  findAll() {
    return this.doorRepository.findAll();
  }

  findOne(id: number) {
    return this.doorRepository.findOne({ id });
  }

  // async open(id: number): Promise<void> {
  //   this.logger.log(`Opening door ${id}`);

  //   // get door with sequence
  //   const door = await this.doorRepository.findOne(
  //     { id },
  //     { populate: ['sequence'] },
  //   );

  //   door.state = 'opening';
  //   await this.update(door);

  //   for (const sequenceObject of door.sequence) {
  //     await this.automationHatService.runSequenceObject(sequenceObject);
  //   }

  //   door.state = 'open';
  //   await this.update(door);

  //   const auditLog = this.auditLogRepository.create({
  //     detail: `Door ${door.id} ${door.state}`,
  //   });
  //   await this.auditLogRepository.persistAndFlush(auditLog);
  // }

  // async toggle(id: number): Promise<void> {
  //   this.logger.log(`Toggle door ${id}`);
  //   const door = await this.findOne(id);

  //   if (door.state === 'closed') {
  //     await this.open(door.id);
  //     return;
  //   }

  //   await this.close(door.id);
  // }

  async update(door: Door): Promise<void> {
    await this.em.persistAndFlush(door);

    // emit all doors inc updated through doors gateway
    const doors = await this.findAll();
    this.doorsGateway.server.emit('doors:list', doors);
  }
}
