import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { ClientVersionModule } from '../client-version/client-version.module';
import { AuditLogsController } from './audit-logs.controller';
import { AuditLogsService } from './audit-logs.service';

describe('AuditLogsController', () => {
  let controller: AuditLogsController;

  let mockAuditLogService: any;

  beforeEach(async () => {
    mockAuditLogService = {
      findAll: jest.fn().mockResolvedValue([
        {
          id: 1,
          detail: 'Door 1 Open',
          timestamp: new Date(0),
        },
        {
          id: 2,
          detail: 'Door 1 Closed',
          timestamp: new Date(1),
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientVersionModule],
      controllers: [AuditLogsController],
      providers: [
        AuthService,
        ConfigService,
        {
          provide: AuditLogsService,
          useValue: mockAuditLogService,
        },
      ],
    }).compile();

    controller = module.get<AuditLogsController>(AuditLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get all doors', async () => {
    const dtos = await controller.getAll();
    expect(dtos).toEqual([
      {
        detail: 'Door 1 Open',
        timestamp: new Date(0),
      },
      {
        detail: 'Door 1 Closed',
        timestamp: new Date(1),
      },
    ]);
  });
});
