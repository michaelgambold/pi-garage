import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

const DOOR_LOCK_KEY_TTL = 60; // in seconds
const DOOR_LOCKED_VALUE = 'locked';

@Injectable()
export class DoorsLockService {
  private readonly redisClient: Redis;

  constructor(private readonly config: ConfigService) {
    this.redisClient = new Redis({
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT'),
      keyPrefix: 'lock',
    });
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
    const key = this.getKey(doorId);
    await this.redisClient.setex(key, DOOR_LOCK_KEY_TTL, DOOR_LOCKED_VALUE);
  }

  async unlockDoor(doorId: number): Promise<void> {
    const key = this.getKey(doorId);
    await this.redisClient.del(key);
  }
}
