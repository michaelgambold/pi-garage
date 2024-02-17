import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
// import { Redis } from 'ioredis';
// import RedisMock from 'ioredis-mock';
import { DoorsLockService } from './doors-lock.service';

describe('DoorsLockService', () => {
  let module: TestingModule;
  let service: DoorsLockService;
  const doorId = 1;

  // let redis;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [DoorsLockService, ConfigService],
    }).compile();

    await module.init();

    service = module.get<DoorsLockService>(DoorsLockService);

    await service.unlockDoor(doorId);
    // const config = module.get<ConfigService>(ConfigService);

    // redis = new RedisMock({
    //   host: config.get('REDIS_HOST'),
    //   port: config.get('REDIS_PORT'),
    // });

    // Redis.mockImplementation();
    // await module.init();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should be unlocked when missing from redis', async () => {
    const doorLocked = await service.isLocked(doorId);
    expect(doorLocked).toEqual(false);
  });

  it('should be able to lock door', async () => {
    await service.lockDoor(doorId);

    const doorLocked = await service.isLocked(1);
    expect(doorLocked).toEqual(true);
  });

  it('should be able to unlock door', async () => {
    await service.lockDoor(doorId);
    await service.unlockDoor(doorId);

    const doorLocked = await service.isLocked(doorId);
    expect(doorLocked).toEqual(false);
  });
});
