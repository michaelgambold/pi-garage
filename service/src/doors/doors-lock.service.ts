import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { Logger } from '../logger/logger';

const DOOR_LOCK_KEY_TTL = 60; // in seconds
const DOOR_LOCKED_VALUE = 'locked';

@Injectable()
export class DoorsLockService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private redisClient: Redis;

  constructor(private readonly config: ConfigService) {
    this.logger = new Logger(DoorsLockService.name);
  }

  async onModuleInit() {
    this.redisClient = new Redis({
      host: this.config.get('REDIS_HOST'),
      port: this.config.get('REDIS_PORT'),
      keyPrefix: 'lock',
    }).on('error', (error) => {
      console.log(error);

      this.logger.error(error);
    });
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  private getKey(doorId: number): string {
    return `$door-${doorId}`;
  }

  async isLocked(doorId: number): Promise<boolean> {
    const key = this.getKey(doorId);
    const count = await this.redisClient.exists(key);

    if (count === 1) {
      const value = await this.redisClient.get(key);
      return value === DOOR_LOCKED_VALUE;
    }

    return false;
  }

  async lockDoor(doorId: number): Promise<void> {
    this.logger.log(`Locking door ${doorId}`);
    const key = this.getKey(doorId);
    await this.redisClient.setex(key, DOOR_LOCK_KEY_TTL, DOOR_LOCKED_VALUE);
  }

  async unlockDoor(doorId: number): Promise<void> {
    this.logger.log(`Unlocking door ${doorId}`);
    const key = this.getKey(doorId);
    await this.redisClient.del(key);
  }
}
