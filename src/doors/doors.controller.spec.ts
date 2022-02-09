import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { DoorsController } from './doors.controller';

describe('DoorsController', () => {
  let controller: DoorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoorsController],
      providers: [ConfigService, AutomationHatService],
    }).compile();

    controller = module.get<DoorsController>(DoorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
