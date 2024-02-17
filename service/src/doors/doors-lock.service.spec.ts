import { Test, TestingModule } from '@nestjs/testing';
import { DoorsLockService } from './doors-lock.service';

describe('DoorsLockService', () => {
  let service: DoorsLockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoorsLockService],
    }).compile();

    service = module.get<DoorsLockService>(DoorsLockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
