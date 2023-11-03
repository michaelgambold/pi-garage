import { Collection } from '@mikro-orm/core';
import {
  BadRequestException,
  // ConflictException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { ClientVersionModule } from '../client-version/client-version.module';
import { Door } from '../entities/Door.entity';
import { SequenceObject } from '../entities/SequenceObject.entity';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';
import { SequenceObjectDto } from './dto/sequence-object.dto';
import { GetDoorDto } from './dto/get-door.dto';

interface MockQueue {
  add(jobName: string, data: unknown, options: unknown): Promise<void>;
}

describe('DoorsController', () => {
  let controller: DoorsController;
  let automationHatService: AutomationHatService;

  let commsOffSpy: jest.SpyInstance<void, []>;
  let commsOnSpy: jest.SpyInstance<void, []>;

  let mockDoorsService: any;

  const mockSequenceRunQueue: MockQueue = {
    async add() {
      return;
    },
  };
  const mockStateUpdateQueue: MockQueue = {
    async add() {
      return;
    },
  };

  beforeEach(async () => {
    mockDoorsService = {
      findAll: jest.fn().mockResolvedValue([
        {
          id: 1,
          isEnabled: true,
          label: 'door1',
          state: 'open',
          closeDuration: 20_000,
          openDuration: 20_000,
        },
        {
          id: 2,
          isEnabled: true,
          label: 'door2',
          state: 'open',
          closeDuration: 20_000,
          openDuration: 20_000,
        },
        {
          id: 3,
          isEnabled: true,
          label: 'door3',
          state: 'open',
          closeDuration: 20_000,
          openDuration: 20_000,
        },
      ]),
      findOne: jest.fn().mockImplementation(async (id: number) => {
        const partialSequence: Partial<Collection<SequenceObject>> = {
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
          sequence: partialSequence as Collection<SequenceObject>,
        };

        return partialDoor;
      }),
      update: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientVersionModule],
      controllers: [DoorsController],
      providers: [
        ConfigService,
        AutomationHatService,
        AuthService,
        {
          provide: DoorsService,
          useValue: mockDoorsService,
        },
        {
          provide: 'BullQueue_doors-sequence-run',
          useValue: mockSequenceRunQueue,
        },
        {
          provide: 'BullQueue_doors-state-update',
          useValue: mockStateUpdateQueue,
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
      const expected: GetDoorDto[] = [
        {
          id: 1,
          isEnabled: true,
          label: 'door1',
          state: 'open',
          closeDuration: 20_000,
          openDuration: 20_000,
        },
        {
          id: 2,
          isEnabled: true,
          label: 'door2',
          state: 'open',
          closeDuration: 20_000,
          openDuration: 20_000,
        },
        {
          id: 3,
          isEnabled: true,
          label: 'door3',
          state: 'open',
          closeDuration: 20_000,
          openDuration: 20_000,
        },
      ];

      const dtos = await controller.getAll();

      expect(dtos).toEqual(expected);

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
      await controller.update(1, {
        isEnabled: true,
        label: 'new label',
        closeDuration: 20_000,
        openDuration: 20_000,
      });

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
    let sequenceQueueSpy: jest.SpyInstance;
    let stateQueueSpy: jest.SpyInstance;

    beforeEach(() => {
      sequenceQueueSpy = jest.spyOn(mockSequenceRunQueue, 'add');
      stateQueueSpy = jest.spyOn(mockStateUpdateQueue, 'add');
    });

    afterEach(() => {
      sequenceQueueSpy.mockClear();
      stateQueueSpy.mockClear();
    });

    it('should update state to open if closed', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
      });

      await controller.updateState(1, { state: 'open' });

      expect(sequenceQueueSpy).toBeCalledWith('open', { doorId: 1 });

      expect(stateQueueSpy).toBeCalledTimes(2);
      expect(stateQueueSpy).toHaveBeenNthCalledWith(1, 'opening', {
        doorId: 1,
      });
      expect(stateQueueSpy).toHaveBeenNthCalledWith(
        2,
        'open',
        { doorId: 1 },
        { delay: 20000 },
      );

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should toggle doors state from open to closed', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
      });

      await controller.updateState(1, { state: 'toggle' });

      expect(sequenceQueueSpy).toBeCalledWith('close', { doorId: 1 });

      expect(stateQueueSpy).toBeCalledTimes(2);
      expect(stateQueueSpy).toHaveBeenNthCalledWith(1, 'closing', {
        doorId: 1,
      });
      expect(stateQueueSpy).toHaveBeenNthCalledWith(
        2,
        'closed',
        { doorId: 1 },
        { delay: 20000 },
      );

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should toggle doors state from closed to open', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
      });

      await controller.updateState(1, { state: 'toggle' });

      expect(sequenceQueueSpy).toBeCalledWith('open', { doorId: 1 });

      expect(stateQueueSpy).toBeCalledTimes(2);
      expect(stateQueueSpy).toHaveBeenNthCalledWith(1, 'opening', {
        doorId: 1,
      });
      expect(stateQueueSpy).toHaveBeenNthCalledWith(
        2,
        'open',
        { doorId: 1 },
        { delay: 20000 },
      );

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should update state to closed from open', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
      });

      await controller.updateState(1, { state: 'close' });

      expect(sequenceQueueSpy).toBeCalledWith('close', { doorId: 1 });

      expect(stateQueueSpy).toBeCalledTimes(2);
      expect(stateQueueSpy).toHaveBeenNthCalledWith(1, 'closing', {
        doorId: 1,
      });
      expect(stateQueueSpy).toHaveBeenNthCalledWith(
        2,
        'closed',
        { doorId: 1 },
        { delay: 20000 },
      );

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should reject opening an open door', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
      });

      await expect(
        controller.updateState(1, { state: 'open' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot open an open/opening door',
      });

      expect(sequenceQueueSpy).not.toBeCalled();
      expect(stateQueueSpy).toBeCalledTimes(0);

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should reject opening an opening door', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'opening',
      });

      await expect(
        controller.updateState(1, { state: 'open' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot open an open/opening door',
      });

      expect(sequenceQueueSpy).not.toBeCalled();
      expect(stateQueueSpy).toBeCalledTimes(0);

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should reject closing a closed door', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
      });

      await expect(
        controller.updateState(1, { state: 'close' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot close a closed/closing door',
      });

      expect(sequenceQueueSpy).not.toBeCalled();
      expect(stateQueueSpy).toBeCalledTimes(0);

      expect(commsOnSpy).toBeCalled();
      expect(commsOffSpy).toBeCalled();
    });

    it('should reject closing a closing door', async () => {
      mockDoorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closing',
      });

      await expect(
        controller.updateState(1, { state: 'close' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot close a closed/closing door',
      });

      expect(sequenceQueueSpy).not.toBeCalled();
      expect(stateQueueSpy).toBeCalledTimes(0);

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

    // it('should return 409 when trying to change state quickly', async () => {
    //   mockDoorsService.findOne.mockResolvedValue({
    //     id: 1,
    //     isEnabled: true,
    //     updatedAt: new Date(),
    //     label: 'door1',
    //     state: 'open',
    //   });

    //   await expect(
    //     controller.updateState(1, { state: 'toggle' }),
    //   ).rejects.toThrowError(ConflictException);

    //   mockDoorsService.findOne.mockReset();
    // });

    // it('should return 409 when door is opening', async () => {
    //   mockDoorsService.findOne.mockResolvedValue({
    //     id: 1,
    //     isEnabled: true,
    //     label: 'door1',
    //     state: 'opening',
    //   });

    //   await expect(
    //     controller.updateState(1, { state: 'toggle' }),
    //   ).rejects.toThrowError(ConflictException);

    //   mockDoorsService.findOne.mockReset();
    // });

    // it('should return 409 when door is closing', async () => {
    //   mockDoorsService.findOne.mockResolvedValue({
    //     id: 1,
    //     isEnabled: true,
    //     label: 'door1',
    //     state: 'closing',
    //   });

    //   await expect(
    //     controller.updateState(1, { state: 'toggle' }),
    //   ).rejects.toThrowError(ConflictException);

    //   expect(commsOnSpy).toBeCalled();
    //   expect(commsOffSpy).toBeCalled();

    //   mockDoorsService.findOne.mockReset();
    // });
  });
});
