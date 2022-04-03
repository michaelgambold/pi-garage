import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomationHatService } from './automation-hat.service';
import { SequenceObject } from '../entities/SequenceObject.entity';

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

  it('should run a sequence object', async () => {
    const sequenceObjects: Partial<SequenceObject>[] = [
      {
        action: 'high',
        duration: 1,
        index: 1,
        target: 'digitalOutput1'
      },
      {
        action: 'high',
        duration: 1,
        index: 1,
        target: 'digitalOutput2'
      },
      {
        action: 'high',
        duration: 1,
        index: 1,
        target: 'digitalOutput3'
      },
      {
        action: 'low',
        duration: 1,
        index: 1,
        target: 'digitalOutput1'
      },
      {
        action: 'low',
        duration: 1,
        index: 1,
        target: 'digitalOutput2'
      },
      {
        action: 'low',
        duration: 1,
        index: 1,
        target: 'digitalOutput3'
      },
      {
        action: 'on',
        duration: 1,
        index: 1,
        target: 'relay1'
      },
      {
        action: 'on',
        duration: 1,
        index: 1,
        target: 'relay2'
      },
      {
        action: 'on',
        duration: 1,
        index: 1,
        target: 'relay3'
      },
      {
        action: 'off',
        duration: 1,
        index: 1,
        target: 'relay1'
      },
      {
        action: 'off',
        duration: 1,
        index: 1,
        target: 'relay2'
      },
      {
        action: 'off',
        duration: 1,
        index: 1,
        target: 'relay3'
      },
    ];

    for (let sequenceObject of sequenceObjects) {
      await service.runSequenceObject(sequenceObject as SequenceObject);
    }
  });

  it('should turn off comms light', () => {
    service.turnOffCommsLight();
  });

  it('should turn on comms light', () => {
    service.turnOnCommsLight();
  })
});
