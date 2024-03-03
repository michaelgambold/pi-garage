import { getRepositoryToken } from '@mikro-orm/nestjs';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/core';

import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { AuditLog } from '../entities/AuditLog.entity';
import { Door } from '../entities/Door.entity';
import { DoorsGateway } from './doors.gateway';
import { DoorsService } from './doors.service';

describe('DoorsService', () => {
  let service: DoorsService;

  const mockEntityManager = {
    persistAndFlush: jest.fn(),
  };

  const mockDoorRepository = {
    findAll: jest
      .fn()
      .mockResolvedValue([
        { id: 1, label: 'door1', isEnabled: true, state: 'closed' },
      ]),
    findOne: jest.fn().mockResolvedValue({
      id: 1,
      label: 'door1',
      isEnabled: true,
      state: 'closed',
      sequence: [
        {
          id: 1,
          index: 1,
          action: 'on',
          target: 'relay1',
          duration: 50,
        },
      ],
    }),
    persistAndFlush: jest.fn().mockResolvedValue(null),
  };

  const mockAuditLogRepository = {
    create: jest.fn().mockImplementation(() => undefined),
    persistAndFlush: jest.fn().mockImplementation(() => undefined),
  };

  const mockDoorsGateway = {
    server: {
      emit: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoorsService,
        AutomationHatService,
        ConfigService,
        {
          provide: getRepositoryToken(Door),
          useValue: mockDoorRepository,
        },
        {
          provide: getRepositoryToken(AuditLog),
          useValue: mockAuditLogRepository,
        },
        {
          provide: DoorsGateway,
          useValue: mockDoorsGateway,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    service = module.get<DoorsService>(DoorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find all doors', async () => {
    const doors = await service.findAll();
    expect(doors.length).toBeGreaterThan(0);
  });

  it('should find one door', async () => {
    const door = await service.findOne(1);
    expect(door.id).toEqual(1);
    expect(door.isEnabled).toEqual(true);
    expect(door.label).toEqual('door1');
    expect(door.state).toEqual('closed');
  });

  it('should update a door', async () => {
    const door = await service.findOne(1);
    await service.update(door);
  });
});
