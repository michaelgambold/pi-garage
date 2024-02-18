import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { Logger } from '../logger/logger';

const DOOR_LOCK_KEY_TTL = 60; // in seconds
const DOOR_LOCKED_VALUE = 'locked';

@Injectable()
export class DoorsLockOutService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger;
  private redisClient: Redis;

  constructor(private readonly config: ConfigService) {
    this.logger = new Logger(DoorsLockOutService.name);
  }

  onModuleInit() {
    this.redisClient = new Redis({
      host: this.config.get('REDIS_HOST'),
      port: this.config.get('REDIS_PORT'),
      keyPrefix: 'door-lock-out',
    }).on('error', (error) => {
      console.log(error);

      this.logger.error(error);
    });
  }

  onModuleDestroy() {
    this.redisClient.disconnect();
  }

  async isLockedOut(doorId: number): Promise<boolean> {
    const count = await this.redisClient.exists(doorId.toString());

    if (count === 1) {
      const value = await this.redisClient.get(doorId.toString());
      return value === DOOR_LOCKED_VALUE;
    }

    return false;
  }

  async lockOutDoor(doorId: number): Promise<void> {
    this.logger.log(`Locking door ${doorId}`);
    await this.redisClient.setex(
      doorId.toString(),
      DOOR_LOCK_KEY_TTL,
      DOOR_LOCKED_VALUE,
    );
  }

  async unlockDoor(doorId: number): Promise<void> {
    this.logger.log(`Unlocking door ${doorId}`);
    await this.redisClient.del(doorId.toString());
  }
}
