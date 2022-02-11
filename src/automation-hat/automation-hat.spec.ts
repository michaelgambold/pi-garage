import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomationHatService } from './automation-hat.service';

describe('AutomationHatService', () => {
  let service: AutomationHatService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutomationHatService, ConfigService],
    }).compile();

    service = module.get<AutomationHatService>(AutomationHatService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have setup automation hat without LED Brightness', () => {
    jest.spyOn(configService, 'get').mockImplementation(() => {
      return undefined;
    });

    expect(service.automationHat).toBeDefined();
  });

  it('should have setup automation hat with LED Brightness', () => {
    jest.spyOn(configService, 'get').mockImplementation(() => {
      return 100;
    });

    expect(service.automationHat).toBeDefined();
  });
});
