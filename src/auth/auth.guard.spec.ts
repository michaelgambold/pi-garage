import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, ConfigService],
    }).compile();
    guard = module.get<AuthGuard>(AuthGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true when no api key in config service', () => {
    const spy = jest.spyOn(configService, 'get');
    spy.mockImplementationOnce(() => {
      return undefined;
    });

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should return true when api key header matches', () => {
    const spy = jest.spyOn(configService, 'get');
    spy.mockImplementationOnce(() => {
      return 'abc123';
    });

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': 'abc123' }, // headers is automatically "lowercased"
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should return false when api key header mismatches', () => {
    const spy = jest.spyOn(configService, 'get');
    spy.mockImplementationOnce(() => {
      return 'abc123';
    });

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': '123abc' }, // headers is automatically "lowercased"
          url: '',
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(false);
  });

  it('should return true when api key query param matches', () => {
    const spy = jest.spyOn(configService, 'get');
    spy.mockImplementationOnce(() => {
      return 'abc123';
    });

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          url: '/api/v1/doors/1?api_key=abc123',
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should return false when api key query param mismatches', () => {
    const spy = jest.spyOn(configService, 'get');
    spy.mockImplementationOnce(() => {
      return 'abc123';
    });

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          url: '/api/v1/doors/1?api_key=123abc',
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(false);
  });
});
