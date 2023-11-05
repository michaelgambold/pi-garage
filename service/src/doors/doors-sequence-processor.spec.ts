import { Test, TestingModule } from '@nestjs/testing';
import { DoorsSequenceProcessor } from './doors-sequence-processor';
import { DoorsService } from './doors.service';
import { Collection, MikroORM } from '@mikro-orm/core';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { DoorSequenceJobName, DoorsSequenceJobData } from './types';
import { SequenceObject } from '../entities/SequenceObject.entity';
import { Door } from '../entities/Door.entity';

describe('DoorsSequenceProcessor', () => {
  let provider: DoorsSequenceProcessor;
  let doorsService: DoorsService;
  let automationHatService: AutomationHatService;
  let orm: MikroORM;

  beforeEach(async () => {
    const mockDoorsService = {
      findOne: jest.fn().mockImplementation(async (id: number) => {
        const partialSequence: Partial<Collection<SequenceObject>> = {
          init: jest.fn().mockResolvedValue(null),
          getItems: jest.fn().mockImplementation(() => {
            const partialSequence: Partial<SequenceObject>[] = [
              {
                id: 1,
                action: 'on',
                duration: 1000,
                index: 1,
                target: 'relay1',
              },
            ];
            return partialSequence;
          }),
        };

        const partialDoor: Partial<Door> = {
          id,
          isEnabled: true,
          label: `door${id}`,
          state: 'open',
          sequence: partialSequence as Collection<SequenceObject>,
        };

        return partialDoor;
      }),
    };

    const mockAutomationHatService = {
      runSequenceObject: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoorsSequenceProcessor,
        ConfigService,
        {
          provide: MikroORM,
          useValue: MikroORM.init(),
        },
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
      } as DoorsSequenceJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(1);
    expect(automationHatServiceSpy).toBeCalledWith(expectedSequenceObj);
  });

  it('should process door close job', async () => {
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
      name: DoorSequenceJobName.CLOSE,
      data: {
        doorId: 1,
      } as DoorsSequenceJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(1);
    expect(automationHatServiceSpy).toBeCalledWith(expectedSequenceObj);
  });

  it('should ignore jobs it does not know about', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const automationHatServiceSpy = jest.spyOn(
      automationHatService,
      'runSequenceObject',
    );

    const job = {
      name: 'some-unknown-job',
      data: {
        doorId: 1,
      } as DoorsSequenceJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).not.toBeCalled();
    expect(automationHatServiceSpy).not.toBeCalled();
  });
});
