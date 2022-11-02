import { MikroORM } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { IncomingMessage } from 'http';
import { disconnect } from 'process';
import { Socket } from 'socket.io';
import { Client } from 'socket.io/dist/client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { AuthService } from '../auth/auth.service';
import { DoorsGateway } from './doors.gateway';
import { DoorsService } from './doors.service';

describe('DoorsGateway', () => {
  let gateway: DoorsGateway;
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
          useValue: {},
        },
        {
          provide: DoorsService,
          useValue: mockDoorsService,
        },
        AuthService,
        ConfigService,
      ],
    }).compile();

    gateway = module.get<DoorsGateway>(DoorsGateway);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  // it('should handle connection when no api key is required', () => {
  //   const partialClient: Partial<Socket> = {
  //     emit: () => undefined,
  //     disconnect: () => undefined,
  //   };

  //   jest.spyOn(authService, 'hasApiKey').mockReturnValueOnce(false);
  //   const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');
  //   const clientEmitSpy = jest.spyOn(partialClient, 'emit');
  //   const clientDisconnectSpy = jest.spyOn(partialClient, 'disconnect');

  //   gateway.handleConnection(partialClient as Socket);

  //   expect(validateApiKeySpy).not.toHaveBeenCalled();
  //   expect(clientEmitSpy).not.toHaveBeenCalled();
  //   expect(clientDisconnectSpy).not.toHaveBeenCalled();
  // });

  // it('should handle connection when api key is required', () => {
  //   const partialClient: Partial<Socket> = {
  //     client: {
  //       request: {
  //         headers: {
  //           'x-api-key': 'abc123',
  //         },
  //       } as unknown as IncomingMessage,
  //     } as Client<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  //     emit: () => undefined,
  //     disconnect: () => undefined,
  //   };

  //   jest.spyOn(authService, 'hasApiKey').mockReturnValueOnce(true);
  //   const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');
  //   const clientEmitSpy = jest.spyOn(partialClient, 'emit');
  //   const clientDisconnectSpy = jest.spyOn(partialClient, 'disconnect');

  //   validateApiKeySpy.mockReturnValueOnce(true);

  //   gateway.handleConnection(partialClient as Socket);

  //   expect(validateApiKeySpy).toHaveBeenCalled();
  //   expect(clientEmitSpy).not.toHaveBeenCalled();
  //   expect(clientDisconnectSpy).not.toHaveBeenCalled();
  // });

  // it('should reject connection when api key is not valid', () => {
  //   const partialClient: Partial<Socket> = {
  //     client: {
  //       request: {
  //         headers: {
  //           'x-api-key': 'abc123',
  //         },
  //       } as unknown as IncomingMessage,
  //     } as Client<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  //     emit: () => undefined,
  //     disconnect: () => undefined,
  //   };

  //   jest.spyOn(authService, 'hasApiKey').mockReturnValueOnce(true);
  //   const validateApiKeySpy = jest.spyOn(authService, 'validateApiKey');
  //   const clientEmitSpy = jest.spyOn(partialClient, 'emit');
  //   const clientDisconnectSpy = jest.spyOn(partialClient, 'disconnect');

  //   validateApiKeySpy.mockReturnValueOnce(false);

  //   gateway.handleConnection(partialClient as Socket);

  //   expect(validateApiKeySpy).toHaveBeenCalled();
  //   expect(clientEmitSpy).toHaveBeenCalled();
  //   expect(clientDisconnectSpy).toHaveBeenCalled();
  // });

  // it('should handle doors:list request', async () => {
  //   const partialClient: Partial<Socket> = {
  //     emit: () => undefined,
  //   };
  //   const clientEmitSpy = jest.spyOn(partialClient, 'emit');

  //   // gateway.handleDoorsList(partialClient as Socket);

  //   expect(clientEmitSpy).toHaveBeenCalledWith('doors:list2');
  // });
});
