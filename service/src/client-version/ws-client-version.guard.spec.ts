import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientVersionService } from './client-version.service';
import { WsClientVersionGuard } from './ws-client-version.guard';

describe('WsClientVersionGuard', () => {
  let guard: WsClientVersionGuard;
  let service: ClientVersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsClientVersionGuard, ClientVersionService],
    }).compile();

    guard = module.get<WsClientVersionGuard>(WsClientVersionGuard);
    service = module.get<ClientVersionService>(ClientVersionService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow if no version specified', () => {
    jest.spyOn(service, 'getServerVersion').mockReturnValue('1.2.3');

    const mockContext = {
      switchToWs() {
        return {
          getData: () => {
            return null;
          },
          getClient: () => {
            return {
              client: {
                request: {
                  headers: {},
                },
              },
            };
          },
        };
      },
    } as Partial<ExecutionContext>;

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should allow a valid version', () => {
    jest.spyOn(service, 'getServerVersion').mockReturnValue('1.2.3');

    const mockContext = {
      switchToWs() {
        return {
          getData: () => {
            return null;
          },
          getClient: () => {
            return {
              client: {
                request: {
                  headers: {
                    'x-client-version': '1.2.3',
                  },
                },
              },
            };
          },
        };
      },
    } as Partial<ExecutionContext>;

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should not allow an invalid version', () => {
    jest.spyOn(service, 'getServerVersion').mockReturnValue('0.0.0');

    const mockContext = {
      switchToWs() {
        return {
          getData: () => {
            return null;
          },
          getClient: () => {
            return {
              client: {
                request: {
                  headers: {
                    'x-client-version': '1.2.3',
                  },
                },
              },
            };
          },
        };
      },
    } as Partial<ExecutionContext>;

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(false);
  });
});
