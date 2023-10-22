import { MikroORM } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { ClientVersionService } from '../client-version/client-version.service';
import { DoorsGateway } from './doors.gateway';
import { DoorsService } from './doors.service';
import { Socket } from 'socket.io';

describe('DoorsGateway', () => {
  let gateway: DoorsGateway;
  let doorsService: DoorsService;
  let orm: MikroORM;
  let clientVersionService: ClientVersionService;
  let authService: AuthService;

  const mockDoorsService = {
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoorsGateway,
        {
          provide: MikroORM,
          useValue: MikroORM.init(),
        },
        {
          provide: DoorsService,
          useValue: mockDoorsService,
        },
        AuthService,
        ConfigService,
        ClientVersionService,
      ],
    }).compile();

    gateway = module.get<DoorsGateway>(DoorsGateway);
    doorsService = module.get<DoorsService>(DoorsService);
    orm = module.get<MikroORM>(MikroORM);
    clientVersionService =
      module.get<ClientVersionService>(ClientVersionService);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    orm.close();
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection method', () => {
    it('should connect with valid key and no client version', () => {
      const client = {
        request: {
          headers: {
            'x-api-key': 'abc123',
          },
        },
      };

      const getServerVersionSpy = jest.spyOn(
        clientVersionService,
        'getServerVersion',
      );
      const satisfiesSpy = jest.spyOn(clientVersionService, 'satisfies');

      const hasApiKeySpy = jest.spyOn(authService, 'hasApiKey');
      hasApiKeySpy.mockReturnValue(true);

      const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');
      validateApiKeySpy.mockReturnValue(true);

      gateway.handleConnection(client as any);

      expect(getServerVersionSpy).not.toBeCalled();
      expect(satisfiesSpy).not.toHaveBeenCalled();
      expect(hasApiKeySpy).toBeCalled();
      expect(validateApiKeySpy).toBeCalledWith('abc123');
    });

    it('should connect with valid key and valid client version', () => {
      const client = {
        request: {
          headers: {
            'x-api-key': 'abc123',
            'x-client-version': '2.0.0',
          },
        },
      };

      const getServerVersionSpy = jest.spyOn(
        clientVersionService,
        'getServerVersion',
      );
      getServerVersionSpy.mockReturnValue('2.0.0');

      const satisfiesSpy = jest.spyOn(clientVersionService, 'satisfies');

      const hasApiKeySpy = jest.spyOn(authService, 'hasApiKey');
      hasApiKeySpy.mockReturnValue(true);

      const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');
      validateApiKeySpy.mockReturnValue(true);

      gateway.handleConnection(client as any);

      expect(getServerVersionSpy).toBeCalled();
      expect(satisfiesSpy).toHaveBeenCalledWith('2.0.0', '2.0.0');
      expect(hasApiKeySpy).toBeCalled();
      expect(validateApiKeySpy).toBeCalledWith('abc123');
    });

    it('should throw error if key is invalid', () => {
      const client = {
        request: {
          headers: {
            'x-api-key': 'abc123',
          },
        },
        emit: jest.fn(),
        disconnect: jest.fn(),
      };

      const getServerVersionSpy = jest.spyOn(
        clientVersionService,
        'getServerVersion',
      );
      const satisfiesSpy = jest.spyOn(clientVersionService, 'satisfies');
      const clientEmitSpy = jest.spyOn(client, 'emit');
      const clientDisconnectSpy = jest.spyOn(client, 'disconnect');

      const hasApiKeySpy = jest.spyOn(authService, 'hasApiKey');
      hasApiKeySpy.mockReturnValue(true);

      const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');
      validateApiKeySpy.mockReturnValue(false);

      // have to spy on client.emit
      gateway.handleConnection(client as any);

      expect(getServerVersionSpy).not.toBeCalled();
      expect(satisfiesSpy).not.toHaveBeenCalled();
      expect(hasApiKeySpy).toBeCalled();
      expect(validateApiKeySpy).toBeCalledWith('abc123');

      expect(clientEmitSpy).toBeCalledWith('error', 'Unauthorized');
      expect(clientDisconnectSpy).toBeCalled();
    });

    it('should connect if no key has been configured', () => {
      const client = {
        request: {
          headers: {
            'x-api-key': 'abc123',
          },
        },
      };

      const getServerVersionSpy = jest.spyOn(
        clientVersionService,
        'getServerVersion',
      );
      const satisfiesSpy = jest.spyOn(clientVersionService, 'satisfies');
      const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');

      const hasApiKeySpy = jest.spyOn(authService, 'hasApiKey');
      hasApiKeySpy.mockReturnValue(false);

      gateway.handleConnection(client as any);

      expect(getServerVersionSpy).not.toBeCalled();
      expect(satisfiesSpy).not.toHaveBeenCalled();
      expect(hasApiKeySpy).toBeCalled();
      expect(validateApiKeySpy).not.toBeCalled();
    });

    it('should throw error if client version is invalid', () => {
      const client = {
        request: {
          headers: {
            'x-api-key': 'abc123',
            'x-client-version': '1.0.0',
          },
        },
        emit: jest.fn(),
        disconnect: jest.fn(),
      };

      const satisfiesSpy = jest.spyOn(clientVersionService, 'satisfies');
      const hasApiKeySpy = jest.spyOn(authService, 'hasApiKey');
      const clientEmitSpy = jest.spyOn(client, 'emit');
      const clientDisconnectSpy = jest.spyOn(client, 'disconnect');

      const getServerVersionSpy = jest.spyOn(
        clientVersionService,
        'getServerVersion',
      );
      getServerVersionSpy.mockReturnValue('2.0.0');

      const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');
      validateApiKeySpy.mockReturnValue(true);

      gateway.handleConnection(client as any);

      expect(getServerVersionSpy).toBeCalled();
      expect(satisfiesSpy).toHaveBeenCalledWith('1.0.0', '2.0.0');
      expect(hasApiKeySpy).not.toBeCalled();
      expect(validateApiKeySpy).not.toBeCalled();

      expect(clientEmitSpy).toBeCalledWith('error', 'Invalid client version');
      expect(clientDisconnectSpy).toBeCalled();
    });
  });

  describe('handleDisconnect method', () => {
    it('should handle disconnect', () => {
      const client = { id: 'abc123' };
      gateway.handleDisconnect(client as Socket);
    });
  });

  describe('handleDoorsList method', () => {
    let client: any;

    beforeEach(() => {
      client = {
        emit: jest.fn(),
      };
    });

    it('should handle doors list message', async () => {
      const findAllDoorsSpy = jest.spyOn(doorsService, 'findAll');

      await gateway.handleDoorsList(client);

      expect(findAllDoorsSpy).toBeCalled();
      expect(client.emit).toHaveBeenCalledWith('doors:list', [
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);
    });
  });
});
