import { Test, TestingModule } from '@nestjs/testing';
import { DoorsSequenceProcessor } from './doors-sequence-processor';
import { DoorsService } from './doors.service';
import { EntityManager } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { ConfigService } from '@nestjs/config';
import { Job, Queue } from 'bullmq';
import { DoorSequenceJobName, DoorsSequenceJobData } from './types';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SequenceObject } from '../entities/SequenceObject.entity';

describe('DoorsSequenceProcessor', () => {
  let provider: DoorsSequenceProcessor;
  let doorsService: DoorsService;
  let automationHatService: AutomationHatService;
  let testQueue: Queue;
  let orm: MikroORM;

  beforeAll(() => {
    // testQueue = new Queue('test-queue', {});
  });

  afterAll(async () => {
    // await testQueue.close();
  });

  beforeEach(async () => {
    const mockDoorsService = {
      findOne: jest.fn().mockResolvedValue({
        sequence: [
          {
            action: 'on',
            duration: 1000,
            id: 1,
            index: 1,
            target: 'relay1',
          },
        ],
      }),
    };

    const mockEntityManager = {
      get: jest.fn(),
    };

    const mockAutomationHatService = {
      runSequenceObject: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      // imports: [MikroOrmModule.forRoot()],
      providers: [
        DoorsSequenceProcessor,
        ConfigService,
        {
          provide: MikroORM,
          useValue: MikroORM.init(),
        },
        // {
        //   provide: EntityManager,
        //   useValue: mockEntityManager,
        // },
        {
          provide: DoorsService,
          useValue: mockDoorsService,
        },
        {
          provide: AutomationHatService,
          useValue: mockAutomationHatService,
        },
      ],
    }).compile();

    provider = module.get<DoorsSequenceProcessor>(DoorsSequenceProcessor);
    doorsService = module.get<DoorsService>(DoorsService);
    automationHatService =
      module.get<AutomationHatService>(AutomationHatService);
    orm = module.get<MikroORM>(MikroORM);
    // entityManager = module.get<EntityManager>(EntityManager);
  });

  afterEach(async () => {
    await orm.close();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should process door open job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const automationHatServiceSpy = jest.spyOn(
      automationHatService,
      'runSequenceObject',
    );
    const expectedSequenceObj = {
      action: 'on',
      duration: 1000,
      id: 1,
      index: 1,
      target: 'relay1',
    };

    const job = {
      name: DoorSequenceJobName.OPEN,
      data: {
        doorId: 1,
      },
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(1);
    expect(automationHatServiceSpy).toBeCalledWith(expectedSequenceObj);
  });

  it('should process door close job', async () => {
    // todo
  });

  it('should ignore jobs it does not know about', async () => {
    // todo
  });
});
