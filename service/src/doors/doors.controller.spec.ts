import { Collection } from '@mikro-orm/core';
import {
  BadRequestException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { Door } from '../entities/Door.entity';
import { SequenceObject } from '../entities/SequenceObject.entity';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';
import { SequenceObjectDto } from './dto/sequence-object.dto';

describe('DoorsController', () => {
  let controller: DoorsController;
  let automationHatService: AutomationHatService;

  let commsOffSpy: jest.SpyInstance<void, []>;
  let commsOnSpy: jest.SpyInstance<void, []>;

  let mockDoorsService: any;

  beforeEach(async () => {
    mockDoorsService = {
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
      findOne: jest.fn().mockImplementation(async (id: number) => {
        const partialSequence: Partial<Collection<SequenceObject, unknown>> = {
          init: jest.fn().mockResolvedValue(null),
          getItems: jest.fn().mockImplementation(() => {
            const partialSequence: Partial<SequenceObject>[] = [
              {
                action: 'on',
                duration: 1000,
                index: 1,
                target: 'relay1',
              },
            ];
            return partialSequence;
          }),
          set: jest.fn().mockResolvedValue(null),
        };

        const partialDoor: Partial<Door> = {
          id,
          isEnabled: true,
          label: `door${id}`,
          state: 'open',
          sequence: partialSequence as Collection<SequenceObject, unknown>,
        };

        return partialDoor;
      }),
      open: jest.fn().mockResolvedValue(undefined),
      toggle: jest.fn().mockResolvedValue(undefined),
      update: jest.fn().mockResolvedValue(undefined),
    };

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
    automationHatService =
      module.get<AutomationHatService>(AutomationHatService);

    commsOffSpy = jest.spyOn(automationHatService, 'turnOffCommsLight');
    commsOnSpy = jest.spyOn(automationHatService, 'turnOnCommsLight');
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

      expect(commsOffSpy).toBeCalled();
      expect(commsOnSpy).toBeCalled();
    });
  });

  describe('Get Door', () => {
    it('should get a door', async () => {
      const door = await controller.get(1);
      expect(door).toBeDefined();
      expect(door.state).toBeTruthy();
      expect(door.isEnabled).toBeTruthy();
      expect(door.label).toBeTruthy();

      expect(commsOffSpy).toBeCalled();
      expect(commsOnSpy).toBeCalled();
    });

    it('should return 400 for invalid door number', async () => {
      const badIds = [-1, 0, 4];

      for (const id of badIds) {
        await expect(controller.get(id)).rejects.toThrow(BadRequestException);
      }

      expect(commsOffSpy).toBeCalled();
      expect(commsOnSpy).toBeCalled();
    });
  });

  describe('Get Door Sequence', () => {
    it('should get a door sequence', async () => {
      const sequence = await controller.getSequence(1);
      expect(sequence.length).toEqual(1);

      const sequenceObject = sequence[0];
      expect(sequenceObject.action).toEqual('on');
      expect(sequenceObject.duration).toEqual(1000);
      expect(sequenceObject.target).toEqual('relay1');

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should throw an error when an invalid door is passed', async () => {
      let failed = false;
      try {
        await controller.getSequence(100);
      } catch (e) {
        failed = true;
      }

      expect(failed).toEqual(true);
      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });
  });

  describe('Update Door', () => {
    it('should return 200 when given valid update request', async () => {
      await controller.update(1, { isEnabled: true, label: 'new label' });

      expect(commsOffSpy).toBeCalled();
      expect(commsOnSpy).toBeCalled();
    });

    it('should return 400 when given invalid door number', async () => {
      const badIds = [-1, 0, 4];

      for (const id of badIds) {
        await expect(controller.get(id)).rejects.toThrowError(
          BadRequestException,
        );
      }

      expect(commsOffSpy).toBeCalled();
      expect(commsOnSpy).toBeCalled();
    });
  });

  describe('Update Door sequence', () => {
    it('should update door sequence', async () => {
      const dto: SequenceObjectDto[] = [
        {
          action: 'on',
          duration: 1000,
          target: 'relay1',
        },
      ];

      await controller.updateSequence(1, dto);

      expect(mockDoorsService.update).toBeCalled();
      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should fail to update for invalid action/target combos', async () => {
      const dtos: SequenceObjectDto[] = [
        {
          action: 'high',
          duration: 1000,
          target: 'relay1',
        },
        {
          action: 'low',
          duration: 1000,
          target: 'relay1',
        },
        {
          action: 'on',
          duration: 1000,
          target: 'digitalOutput1',
        },
        {
          action: 'off',
          duration: 1000,
          target: 'digitalOutput1',
        },
      ];

      for (const dto of dtos) {
        let error: Error;

        try {
          await controller.updateSequence(1, [dto]);
        } catch (e) {
          error = e;
        }

        expect(error).toBeDefined();
        expect(commsOnSpy).toBeCalled();
        expect(commsOffSpy).toBeCalled();
      }
    });

    it('should fail to update for invalid door id', async () => {
      let error: HttpException;

      try {
        await controller.updateSequence(100, []);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.getStatus()).toEqual(400);
      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should fail to update for negative duration', async () => {
      const dto: SequenceObjectDto[] = [
        {
          action: 'on',
          duration: -1,
          target: 'relay1',
        },
      ];

      expect(
        controller.updateSequence(1, dto).catch((e) => {
          expect(e).toBeDefined();
        }),
      );

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });
  });

  describe('Update Door State', () => {
    it('should update state to open', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
      });

      await controller.updateState(1, { state: 'open' });

      expect(mockDoorsService.open).toBeCalled();
      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should toggle doors state', async () => {
      await controller.updateState(1, { state: 'toggle' });

      expect(mockDoorsService.toggle).toBeCalled();
      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should update state to closed', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
      });

      await controller.updateState(1, { state: 'close' });

      expect(mockDoorsService.close).toBeCalled();
      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should return 400 for invalid door id', async () => {
      const badIds = [-1, 0, 4];

      for (const id of badIds) {
        await expect(
          controller.updateState(id, { state: 'toggle' }),
        ).rejects.toThrowError(BadRequestException);
      }

      expect(commsOffSpy).toBeCalledTimes(3);
      expect(commsOnSpy).toBeCalledTimes(3);
    });

    it('should return 409 when door is opening', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'opening',
      });

      await expect(
        controller.updateState(1, { state: 'toggle' }),
      ).rejects.toThrowError(ConflictException);

      mockDoorsService.findOne.mockReset();
    });

    it('should return 409 when door is closing', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closing',
      });

      await expect(
        controller.updateState(1, { state: 'toggle' }),
      ).rejects.toThrowError(ConflictException);

      mockDoorsService.findOne.mockReset();
    });

    it('should not try and open door if already open', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
      });

      await controller.updateState(1, { state: 'open' });

      expect(mockDoorsService.open).not.toBeCalled();

      mockDoorsService.findOne.mockReset();
    });

    it('should not try and close door if already closed', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
      });

      await controller.updateState(1, { state: 'close' });

      expect(mockDoorsService.close).not.toBeCalled();

      mockDoorsService.findOne.mockReset();
    });
  });
});
