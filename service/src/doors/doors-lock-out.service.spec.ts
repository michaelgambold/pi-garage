import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { DoorsLockOutService } from './doors-lock-out.service';

describe('DoorsLockService', () => {
  let module: TestingModule;
  let service: DoorsLockOutService;
  let config: ConfigService;
  let container: StartedTestContainer;

  const doorId = 1;

  beforeAll(async () => {
    try {
      container = await new GenericContainer('redis')
        .withExposedPorts(6379)
        .start();
      const redisHost = container.getHost();
      const redisPort = container.getMappedPort(6379);

      config = new ConfigService();
      config.set('REDIS_HOST', redisHost);
      config.set('REDIS_PORT', redisPort);
    } catch (error) {
      console.error('Error starting Redis container:', error);
      throw error;
    }
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        DoorsLockOutService,
        {
          provide: ConfigService,
          useValue: config,
        },
      ],
    }).compile();

    await module.init();

    service = module.get<DoorsLockOutService>(DoorsLockOutService);

    await service.unlockDoor(doorId);
  });

  afterEach(async () => {
    await module.close();
  });

  afterAll(async () => {
    await container.stop();
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
