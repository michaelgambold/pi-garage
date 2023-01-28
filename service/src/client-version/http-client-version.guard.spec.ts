import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientVersionService } from './client-version.service';
import { HttpClientVersionGuard } from './http-client-version.guard';

describe('ClientVersionGuard', () => {
  let guard: HttpClientVersionGuard;
  let service: ClientVersionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpClientVersionGuard, ClientVersionService],
    }).compile();

    guard = module.get<HttpClientVersionGuard>(HttpClientVersionGuard);
    service = module.get<ClientVersionService>(ClientVersionService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should pass when no client version given', async () => {
    jest.spyOn(service, 'getServerVersion').mockReturnValue('1.2.3');

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should pass when a version is satisfied', async () => {
    jest.spyOn(service, 'getServerVersion').mockReturnValue('1.2.3');

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-client-version': '1.2.3',
          },
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(true);
  });

  it('should fail when a version is not satisified', async () => {
    jest.spyOn(service, 'getServerVersion').mockReturnValue('0.0.0');

    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            'x-client-version': '1.2.3',
          },
        }),
      }),
    };

    expect(guard.canActivate(mockContext as ExecutionContext)).toEqual(false);
  });
});
