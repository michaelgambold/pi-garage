import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { WsApiKeyAuthGuard } from './ws-api-key-auth.guard';

describe('WsApiKeyAuthGuard', () => {
  let guard: WsApiKeyAuthGuard;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsApiKeyAuthGuard, AuthService, ConfigService],
    }).compile();

    guard = module.get<WsApiKeyAuthGuard>(WsApiKeyAuthGuard);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no api key in auth service', () => {
    jest.spyOn(authService, 'hasApiKey').mockImplementation(() => {
      return false;
    });

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
                    'x-api-key': 'abc123',
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

  it('should return true when api key header matches', () => {
    jest.spyOn(authService, 'hasApiKey').mockImplementation(() => {
      return true;
    });

    jest.spyOn(authService, 'validateApiKey').mockImplementation(() => {
      return true;
    });

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
                    'x-api-key': 'abc123',
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

  it('should throw when api key header mismatches', () => {
    jest.spyOn(authService, 'hasApiKey').mockImplementation(() => {
      return true;
    });

    jest.spyOn(authService, 'validateApiKey').mockImplementation(() => {
      return false;
    });

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
                    'x-api-key': 'abc123',
                  },
                },
              },
            };
          },
        };
      },
    } as Partial<ExecutionContext>;

    expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
      'Unauthorized',
    );
  });
});
