import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DoorsLockOutService } from './doors-lock-out.service';

describe('DoorsLockService', () => {
  let module: TestingModule;
  let service: DoorsLockOutService;
  const doorId = 1;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [DoorsLockOutService, ConfigService],
    }).compile();

    await module.init();

    service = module.get<DoorsLockOutService>(DoorsLockOutService);

    await service.unlockDoor(doorId);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(service).toBeDefined();
  });

  it('should be unlocked when missing from redis', async () => {
    const doorLocked = await service.isLockedOut(doorId);
    expect(doorLocked).toEqual(false);
  });

  it('should be able to lock door', async () => {
    await service.lockOutDoor(doorId);

    const doorLocked = await service.isLockedOut(1);
    expect(doorLocked).toEqual(true);
  });

  it('should be able to unlock door', async () => {
    await service.lockOutDoor(doorId);
    await service.unlockDoor(doorId);

    const doorLocked = await service.isLockedOut(doorId);
    expect(doorLocked).toEqual(false);
  });
});
