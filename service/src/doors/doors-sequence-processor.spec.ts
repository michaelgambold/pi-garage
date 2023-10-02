import { Test, TestingModule } from '@nestjs/testing';
import { DoorsSequenceProcessor } from './doors-sequence-processor';
import { DoorsService } from './doors.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { ConfigService } from '@nestjs/config';

describe('DoorsSequenceProcessor', () => {
  let provider: DoorsSequenceProcessor;
  // let doorsService: DoorsService;
  // let entityManager: EntityManager;

  beforeEach(async () => {
    const mockDoorsService = {
      get: jest.fn().mockResolvedValue({}),
    };

    const mockEntityManager = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoorsSequenceProcessor,
        AutomationHatService,
        ConfigService,
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
      ],
    }).compile();

    provider = module.get<DoorsSequenceProcessor>(DoorsSequenceProcessor);
    // doorsService = module.get<DoorsService>(DoorsService);
    // entityManager = module.get<EntityManager>(EntityManager);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
