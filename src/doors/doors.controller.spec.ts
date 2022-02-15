import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';

describe('DoorsController', () => {
  let controller: DoorsController;

  const mockDoorsService = {
    close: jest.fn().mockResolvedValue(undefined),
    findAll: jest.fn().mockResolvedValue([
      {
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
      },
      {
        id: 2,
        isEnabled: true,
        label: 'door2',
        state: 'open',
      },
      {
        id: 3,
        isEnabled: true,
        label: 'door3',
        state: 'open',
      },
    ]),
    findOne: jest.fn().mockImplementation((id: number) => {
      return Promise.resolve({
        id,
        isEnabled: true,
        label: `door${id}`,
        state: 'open',
      });
    }),
    open: jest.fn().mockResolvedValue(undefined),
    toggle: jest.fn().mockResolvedValue(undefined),
    update: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoorsController],
      providers: [
        ConfigService,
        AutomationHatService,
        AuthService,
        {
          provide: DoorsService,
          useValue: mockDoorsService,
        },
      ],
    }).compile();

    controller = module.get<DoorsController>(DoorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get All Doors', () => {
    it('should get all doors', async () => {
      const dtos = await controller.getAll();
      expect(dtos.length).toEqual(3);

      expect(dtos.filter((dto) => dto.id === 1).length).toEqual(1);
      expect(dtos.filter((dto) => dto.id === 2).length).toEqual(1);
      expect(dtos.filter((dto) => dto.id === 3).length).toEqual(1);

      dtos.forEach((dto) => {
        expect(dto.isEnabled).toBeTruthy();
        expect(dto.label).toBeTruthy();
        expect(dto.state).toBeTruthy();
      });
    });
  });

  describe('Get Door', () => {
    it('should get a door', async () => {
      const door = await controller.get(1);
      expect(door).toBeDefined();
      expect(door.state).toBeTruthy();
      expect(door.isEnabled).toBeTruthy();
      expect(door.label).toBeTruthy();
    });
  });

  it('should return 400 for invalid door number', async () => {
    const badIds = [-1, 0, 4];

    for (const id of badIds) {
      await expect(controller.get(id)).rejects.toThrow(BadRequestException);
    }
  });

  describe('Update Door', () => {
    it('should return 200 when given valid update request', async () => {
      await controller.update(1, { isEnabled: true, label: 'new label' });
    });

    it('should return 400 when given invalid door number', async () => {
      const badIds = [-1, 0, 4];

      for (const id of badIds) {
        await expect(controller.get(id)).rejects.toThrowError(
          BadRequestException,
        );
      }
    });
  });

  describe('Update Door State', () => {
    it('should update doors state', async () => {
      await controller.updateState(1, {
        state: 'close',
      });

      await controller.updateState(1, {
        state: 'open',
      });

      await controller.updateState(1, {
        state: 'toggle',
      });
    });

    it('should return 400 for invalid door id', async () => {
      const badIds = [-1, 0, 4];

      for (const id of badIds) {
        await expect(controller.get(id)).rejects.toThrowError(
          BadRequestException,
        );
      }
    });
  });
});
