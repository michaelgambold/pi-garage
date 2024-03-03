import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/sqlite';
import { MikroORM } from '@mikro-orm/core';
import { Job } from 'bullmq';
import { DoorsService } from './doors.service';
import { DoorsStateProcessor } from './doors-state-processor';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { DoorStateJobName, DoorsStateJobData } from './types';
import { DoorsGateway } from './doors.gateway';

describe('DoorsSequenceProcessor', () => {
  let provider: DoorsStateProcessor;
  let doorsService: DoorsService;
  let auditLogsService: AuditLogsService;
  let orm: MikroORM;
  let doorsGateway: DoorsGateway;

  beforeEach(async () => {
    const mockEntityManager = {
      get: jest.fn(),
    };

    const mockDoorsService = {
      findOne: jest.fn().mockResolvedValue({
        id: 1,
      }),
      findAll: jest.fn().mockResolvedValue([
        {
          id: 1,
        },
        {
          id: 2,
        },
        {
          id: 3,
        },
      ]),
    };

    const mockAuditLogsService = {
      create: jest.fn(),
    };

    const mockDoorsGateway = {
      server: {
        emit: jest.fn(),
      },
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
        {
          provide: DoorsGateway,
          useValue: mockDoorsGateway,
        },
      ],
    }).compile();

    provider = module.get<DoorsStateProcessor>(DoorsStateProcessor);
    doorsService = module.get<DoorsService>(DoorsService);
    auditLogsService = module.get<AuditLogsService>(AuditLogsService);
    orm = module.get<MikroORM>(MikroORM);
    doorsGateway = module.get<DoorsGateway>(DoorsGateway);
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
    const gatewayEmitSpy = jest.spyOn(doorsGateway.server, 'emit');

    const job = {
      name: DoorStateJobName.CLOSED,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toHaveBeenCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 closed');
    expect(gatewayEmitSpy).toHaveBeenCalledWith('doors:list', [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it('should process closing job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');
    const gatewayEmitSpy = jest.spyOn(doorsGateway.server, 'emit');

    const job = {
      name: DoorStateJobName.CLOSING,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toHaveBeenCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 closing');
    expect(gatewayEmitSpy).toHaveBeenCalledWith('doors:list', [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it('should process open job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');
    const gatewayEmitSpy = jest.spyOn(doorsGateway.server, 'emit');

    const job = {
      name: DoorStateJobName.OPEN,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toHaveBeenCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 open');
    expect(gatewayEmitSpy).toHaveBeenCalledWith('doors:list', [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it('should process opening job', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');
    const gatewayEmitSpy = jest.spyOn(doorsGateway.server, 'emit');

    const job = {
      name: DoorStateJobName.OPENING,
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toHaveBeenCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy.mock.calls[0][1]).toEqual('Door 1 opening');
    expect(gatewayEmitSpy).toHaveBeenCalledWith('doors:list', [
      { id: 1 },
      { id: 2 },
      { id: 3 },
    ]);
  });

  it('should handle invalid job name', async () => {
    const doorsServiceSpy = jest.spyOn(doorsService, 'findOne');
    const auditLogsServiceSpy = jest.spyOn(auditLogsService, 'create');
    const gatewayEmitSpy = jest.spyOn(doorsGateway.server, 'emit');

    const job = {
      name: 'unkown-job',
      data: {
        doorId: 1,
      } as DoorsStateJobData,
    };

    await provider.process(job as Job);

    expect(doorsServiceSpy).toHaveBeenCalledWith(job.data.doorId);
    expect(auditLogsServiceSpy).not.toHaveBeenCalled();
    expect(gatewayEmitSpy).not.toHaveBeenCalled();
  });
});
