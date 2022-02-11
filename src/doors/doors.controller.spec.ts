import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { DoorsController } from './doors.controller';

describe('DoorsController', () => {
  let controller: DoorsController;
  let automationHatService: AutomationHatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoorsController],
      providers: [ConfigService, AutomationHatService, AuthService],
    }).compile();

    controller = module.get<DoorsController>(DoorsController);
    automationHatService =
      module.get<AutomationHatService>(AutomationHatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Update Door', () => {
    it('should return 200 when given valid update request', () => {
      const spy = jest.spyOn(automationHatService, 'automationHat', 'get');
      controller.update(1);
      controller.update(2);
      controller.update(3);

      expect(spy).toBeCalledTimes(3);
    });

    it('should return 400 when given invalid door number', () => {
      expect(() => {
        controller.update(-1);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.update(0);
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.update(4);
      }).toThrowError(BadRequestException);
    });
  });
});
