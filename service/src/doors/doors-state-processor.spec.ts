import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { Job } from 'bullmq';
import { DoorsService } from './doors.service';
import { DoorsStateProcessor } from './doors-state-processor';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { DoorStateJobName, DoorsStateJobData } from './types';

describe('DoorsSequenceProcessor', () => {
  let provider: DoorsStateProcessor;
  let doorsService: DoorsService;
  let auditLogsService: AuditLogsService;
  let orm: MikroORM;

  beforeEach(async () => {
    const mockEntityManager = {
      get: jest.fn(),
    };

    const mockDoorsService = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
      }),
    };

    const mockAuditLogsService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoorsStateProcessor,
        {
          provide: MikroORM,
          useValue: MikroORM.init(),
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: AuditLogsService,
          useValue: mockAuditLogsService,
        },
        {
          provide: DoorsService,
          useValue: mockDoorsService,
        },
      ],
    }).compile();

    provider = module.get<DoorsStateProcessor>(DoorsStateProcessor);
    doorsService = module.get<DoorsService>(DoorsService);
    auditLogsService = module.get<AuditLogsService>(AuditLogsService);
    orm = module.get<MikroORM>(MikroORM);
  });

  afterEach(() => {
    orm.close();
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  it('should process closed job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');

    const job = {
      name: DoorStateJobName.CLOSED,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 closed');
  });

  it('should process closing job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');

    const job = {
      name: DoorStateJobName.CLOSING,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 closing');
  });

  it('should process open job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');

    const job = {
      name: DoorStateJobName.OPEN,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 open');
  });

  it('should process opening job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');

    const job = {
      name: DoorStateJobName.OPENING,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 opening');
  });

  it('should handle invalid job name', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');

    const job = {
      name: 'unkown-job',
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toBeCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy).not.toBeCalled();
  });
});
