import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { DoorsService } from './doors.service';

describe('DoorsService', () => {
  let service: DoorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoorsService, AutomationHatService, ConfigService],
    }).compile();

    service = module.get<DoorsService>(DoorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
