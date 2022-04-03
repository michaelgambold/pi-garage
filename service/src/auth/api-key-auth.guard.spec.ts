import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyAuthGuard } from './api-key-auth.guard';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let guard: ApiKeyAuthGuard;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiKeyAuthGuard, AuthService, ConfigService],
    }).compile();

    guard = module.get<ApiKeyAuthGuard>(ApiKeyAuthGuard);
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
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          url: '',
        }),
      }),
    };

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
      switchToHttp: () => ({
        getRequest: () => ({
          headers: { 'x-api-key': 'abc123' }, // headers is automatically "lowercased"
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should return false when api key header mismatches', () => {
    jest.spyOn(authService, 'hasApiKey').mockImplementation(() => {
      return true;
    });

    jest.spyOn(authService, 'validateApiKey').mockImplementation(() => {
      return false;
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
    jest.spyOn(authService, 'hasApiKey').mockImplementation(() => {
      return true;
    });

    jest.spyOn(authService, 'validateApiKey').mockImplementation(() => {
      return true;
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
    jest.spyOn(authService, 'hasApiKey').mockImplementation(() => {
      return true;
    });

    jest.spyOn(authService, 'validateApiKey').mockImplementation(() => {
      return false;
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

  it('should throw unauthorized error when key defined and no query/header key defined', () => {
    jest.spyOn(authService, 'hasApiKey').mockImplementation(() => {
      return true;
    });

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          url: '/api/v1/doors/1',
        }),
      }),
    };

    expect(() => {
      guard.canActivate(mockContext as ExecutionContext);
    }).toThrowError(UnauthorizedException);
  });
});
