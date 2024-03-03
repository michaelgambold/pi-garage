import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;
  let automationHatService: AutomationHatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [ConfigService, AutomationHatService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    automationHatService =
      module.get<AutomationHatService>(AutomationHatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return ok message', async () => {
    const commsOffSpy = jest.spyOn(automationHatService, 'turnOffCommsLight');
    const commsOnSpy = jest.spyOn(automationHatService, 'turnOnCommsLight');

    const res = await controller.getHealth();
    expect(res).toEqual({ message: 'ok' });

    expect(commsOffSpy).toHaveBeenCalled();
    expect(commsOnSpy).toHaveBeenCalled();
  });
});
