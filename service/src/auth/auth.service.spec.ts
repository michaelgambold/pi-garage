import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true if we have an api key defined', () => {
    jest.spyOn(configService, 'get').mockImplementation(() => {
      return 'abc123';
    });

    expect(service.hasApiKey()).toEqual(true);
  });

  it('should return false if we do not have an api key defined', () => {
    jest.spyOn(configService, 'get').mockImplementation(() => {
      return undefined;
    });

    expect(service.hasApiKey()).toEqual(false);
  });

  it('should validate api key', () => {
    jest.spyOn(configService, 'get').mockImplementation(() => {
      return 'abc123';
    });

    expect(service.validateApiKey('abc123')).toEqual(true);
    expect(service.validateApiKey('123abc')).toEqual(false);
  });
});
