import { Test, TestingModule } from '@nestjs/testing';
import { DoorsStateProcessor } from './doors-state-processor';
import { DoorsService } from './doors.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { AuditLogsService } from '../audit-logs/audit-logs.service';

describe('DoorsSequenceProcessor', () => {
  let provider: DoorsStateProcessor;
  // let doorsService: DoorsService;
  // let entityManager: EntityManager;

  beforeEach(async () => {
    const mockDoorsService = {
      get: jest.fn().mockResolvedValue({}),
    };

    const mockEntityManager = {
      get: jest.fn(),
    };

    const mockAuditLogService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoorsStateProcessor,
        {
          provide: MikroORM,
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: DoorsService,
          useValue: mockDoorsService,
        },
        {
          provide: AuditLogsService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    provider = module.get<DoorsStateProcessor>(DoorsStateProcessor);
    // doorsService = module.get<DoorsService>(DoorsService);
    // entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
