import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';

describe('DoorsController', () => {
  let controller: DoorsController;
  let automationHatService: AutomationHatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoorsController],
      providers: [
        ConfigService,
        DoorsService,
        AutomationHatService,
        AuthService,
      ],
    }).compile();

    controller = module.get<DoorsController>(DoorsController);
    automationHatService =
      module.get<AutomationHatService>(AutomationHatService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get All Doors', () => {
    it('should get all doors', () => {
      const dtos = controller.getAll();
      expect(dtos.length).toEqual(3);

      expect(dtos.filter((dto) => dto.door === 1).length).toEqual(1);
      expect(dtos.filter((dto) => dto.door === 2).length).toEqual(1);
      expect(dtos.filter((dto) => dto.door === 3).length).toEqual(1);

      dtos.forEach((dto) => {
        expect(dto.state).toBeTruthy();
      });
    });
  });

  describe('Get Door', () => {
    it('should get a door', () => {
      [1, 2, 3].forEach((doorNumber) => {
        const door = controller.get(doorNumber);
        expect(door).toBeDefined();
        expect(door.state).toBeTruthy();
      });
    });

    it('should return 400 for invalid door number', () => {
      [-1, 0, 4].forEach((doorNumber) => {
        expect(() => {
          controller.get(doorNumber);
        }).toThrowError(BadRequestException);
      });
    });
  });

  describe('Update all Doors', () => {
    it('should return 200 when given valid update all request', () => {
      controller.updateAll([
        {
          action: 'close',
          door: 1,
        },
        {
          action: 'open',
          door: 2,
        },
        {
          action: 'toggle',
          door: 3,
        },
      ]);
    });

    it('should return 400 when given invalid update all request', () => {
      [-1, 0, 4].forEach((doorNumber) => {
        expect(() => {
          controller.updateAll([
            {
              action: 'close',
              door: doorNumber,
            },
          ]);
        }).toThrow(BadRequestException);
      });
    });
  });

  describe('Update Door', () => {
    it('should return 200 when given valid update request', () => {
      const spy = jest.spyOn(automationHatService, 'automationHat', 'get');
      controller.update(1, { action: 'close' });
      controller.update(2, { action: 'open' });
      controller.update(3, { action: 'toggle' });

      expect(spy).toBeCalledTimes(3);
    });

    it('should return 400 when given invalid door number', () => {
      expect(() => {
        controller.update(-1, { action: 'toggle' });
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.update(0, { action: 'toggle' });
      }).toThrowError(BadRequestException);

      expect(() => {
        controller.update(4, { action: 'toggle' });
      }).toThrowError(BadRequestException);
    });
  });
});
