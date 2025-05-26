import { Collection } from '@mikro-orm/core';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { ClientVersionModule } from '../client-version/client-version.module';
import { Door } from '../entities/Door.entity';
import { SequenceObject } from '../entities/SequenceObject.entity';
import { DoorsController } from './doors.controller';
import { DoorsService } from './doors.service';
import { SequenceObjectDto, GetDoorDto } from './dto';
import { DoorsLockOutService } from './doors-lock-out.service';

interface MockQueue {
  add(jobName: string, data: unknown, options: unknown): Promise<void>;
}

describe('DoorsController', () => {
  let controller: DoorsController;

  let doorsService: jest.Mocked<DoorsService>;
  let automationHatService: jest.Mocked<AutomationHatService>;
  let doorsSequenceRunQueue: jest.Mocked<MockQueue>;
  let doorsStateUpdateQueue: jest.Mocked<MockQueue>;
  let doorsLockOutService: jest.Mocked<DoorsLockOutService>;

  beforeEach(async () => {
    doorsService = {
      findAll: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<DoorsService>;

    automationHatService = {
      turnOnCommsLight: jest.fn(),
      turnOffCommsLight: jest.fn(),
    } as unknown as jest.Mocked<AutomationHatService>;

    doorsLockOutService = {
      isLockedOut: jest.fn().mockResolvedValue(false),
    } as unknown as jest.Mocked<DoorsLockOutService>;

    doorsSequenceRunQueue = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MockQueue>;

    doorsStateUpdateQueue = {
      add: jest.fn(),
    } as unknown as jest.Mocked<MockQueue>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [ClientVersionModule],
      controllers: [DoorsController],
      providers: [
        ConfigService,
        AuthService,
        {
          provide: AutomationHatService,
          useValue: automationHatService,
        },
        {
          provide: DoorsLockOutService,
          useValue: doorsLockOutService,
        },
        {
          provide: DoorsService,
          useValue: doorsService,
        },
        {
          provide: 'BullQueue_doors-sequence-run',
          useValue: doorsSequenceRunQueue,
        },
        {
          provide: 'BullQueue_doors-state-update',
          useValue: doorsStateUpdateQueue,
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
      // Arrange
      doorsService.findAll = jest.fn().mockResolvedValue([
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
      ]);

      // Act
      const dtos = await controller.getAll();

      // Assert
      expect(dtos).toEqual([
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
      ] satisfies GetDoorDto[]);

      expect(doorsService.findAll).toHaveBeenCalled();
      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
    });
  });

  describe('Get Door', () => {
    it('should get a door', async () => {
      // Arrange
      doorsService.findOne = jest.fn().mockResolvedValue({
        id: 1,
        label: 'Door 1',
        isEnabled: true,
        state: 'opening',
        openDuration: 20000,
        closeDuration: 15000,
        updatedAt: new Date(2025, 0, 1, 12, 0, 0),
      } as Door);

      // Act
      const door = await controller.get(1);

      // Assert
      expect(door).toEqual({
        id: 1,
        label: 'Door 1',
        isEnabled: true,
        state: 'opening',
        openDuration: 20000,
        closeDuration: 15000,
      } satisfies GetDoorDto);

      expect(doorsService.findOne).toHaveBeenCalledWith(1);
      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
    });

    it.each([-1, 0, 4])(
      'should return 400 for invalid door number: %p',
      async (id) => {
        // Act
        await expect(controller.get(id)).rejects.toThrow(BadRequestException);

        // Assert
        expect(doorsService.findOne).not.toHaveBeenCalled();
        expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
        expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
      },
    );
  });

  describe('Get Door Sequence', () => {
    it('should get a door sequence', async () => {
      // Arrange
      const door = {
        sequence: {
          init: jest.fn().mockResolvedValue(null),
          getItems: jest.fn().mockReturnValue([
            {
              action: 'on',
              duration: 1000,
              index: 1,
              target: 'relay1',
            },
          ]),
        },
      } as unknown as Door;
      doorsService.findOne = jest.fn().mockResolvedValue(door);

      // Act
      const sequence = await controller.getSequence(1);

      // Assert
      expect(sequence).toEqual([
        {
          action: 'on',
          duration: 1000,
          target: 'relay1',
        },
      ] satisfies SequenceObjectDto[]);

      expect(doorsService.findOne).toHaveBeenCalledWith(1);
      expect(door.sequence.init).toHaveBeenCalled();
      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should throw an error when an invalid door is passed', async () => {
      // Act
      await expect(controller.getSequence(100)).rejects.toThrow(
        BadRequestException,
      );

      // Assert
      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });
  });

  describe('Update Door', () => {
    it('should return 200 when given valid update request', async () => {
      // Arrange
      doorsService.findOne = jest.fn().mockResolvedValue({
        id: 1,
        isEnabled: false,
        label: 'door1',
        closeDuration: 0,
        openDuration: 0,
      } as Door);

      // Act
      await controller.update(1, {
        isEnabled: true,
        label: 'new label',
        closeDuration: 20_000,
        openDuration: 20_000,
      });

      // Assert
      expect(doorsService.findOne).toHaveBeenCalledWith(1);
      expect(doorsService.update).toHaveBeenCalledWith({
        id: 1,
        isEnabled: true,
        label: 'new label',
        closeDuration: 20_000,
        openDuration: 20_000,
      });

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it.each([-1, 0, 4])(
      'should return 400 for invalid door number: %p',
      async (id) => {
        // Act
        await expect(controller.get(id)).rejects.toThrow(BadRequestException);

        // Assert
        expect(doorsService.findOne).not.toHaveBeenCalled();

        expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
        expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
      },
    );
  });

  describe('Update Door sequence', () => {
    it('should update door sequence', async () => {
      // Arrange
      const id = 1;

      const door = {
        id,
        sequence: {
          init: jest.fn(),
          getItems: jest.fn().mockReturnValue([
            {
              action: 'off',
              duration: 2000,
              index: 1,
              target: 'relay2',
            },
          ]),
          set: jest.fn(),
        } as unknown as Collection<SequenceObject>,
      } as Door;
      doorsService.findOne = jest.fn().mockResolvedValue(door);

      const dto: SequenceObjectDto[] = [
        {
          action: 'on',
          duration: 1000,
          target: 'relay1',
        },
      ];

      // Act
      await controller.updateSequence(id, dto);

      // Assert
      expect(doorsService.findOne).toHaveBeenCalledWith(id);
      expect(door.sequence.init).toHaveBeenCalled();

      expect(door.sequence.set).toHaveBeenCalledWith([
        {
          action: 'on',
          door: door,
          duration: 1000,
          index: 0,
          target: 'relay1',
        },
      ]);

      expect(doorsService.update).toHaveBeenCalledWith({
        id,
        sequence: door.sequence,
      });

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it.each([
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
    ] satisfies SequenceObjectDto[])(
      'should fail for invalid action/target combo: %p',
      async (sequenceObject) => {
        // Act
        await expect(
          controller.updateSequence(1, [sequenceObject]),
        ).rejects.toThrow(BadRequestException);

        // Assert
        expect(doorsService.findOne).not.toHaveBeenCalled();
        expect(doorsService.update).not.toHaveBeenCalled();
        expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
        expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      },
    );

    it('should fail for invalid door id', async () => {
      await expect(controller.updateSequence(100, [])).rejects.toThrow(
        BadRequestException,
      );

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should fail for negative duration', async () => {
      // Arrange
      const dto: SequenceObjectDto[] = [
        {
          action: 'on',
          duration: -1,
          target: 'relay1',
        },
      ];

      // Act
      expect(
        controller.updateSequence(1, dto).catch((e) => {
          expect(e).toBeDefined();
        }),
      );

      // Assert
      expect(doorsService.findOne).not.toHaveBeenCalled();
      expect(doorsService.update).not.toHaveBeenCalled();
      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });
  });

  describe('Update Door State', () => {
    it.each([-1, 0, 4])(
      'should return 400 for invalid door id: %p',
      async (id) => {
        // Act
        await expect(
          controller.updateState(id, { state: 'toggle' }),
        ).rejects.toThrow(BadRequestException);

        // Assert
        expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
        expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
      },
    );

    it('should return 409 when door is locked out', async () => {
      // Assert
      doorsLockOutService.isLockedOut.mockResolvedValue(true);

      // Act
      await expect(
        controller.updateState(1, { state: 'close' }),
      ).rejects.toMatchObject({
        constructor: ConflictException,
        message: 'Door changing state is locked out',
      });

      // Assert
      expect(doorsService.findOne).not.toHaveBeenCalled();
      expect(doorsSequenceRunQueue.add).not.toHaveBeenCalled();
      expect(doorsStateUpdateQueue.add).not.toHaveBeenCalled();

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should update state to open if closed', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
        openDuration: 20_000,
        closeDuration: 20_000,
      } as Door);

      // Act
      await controller.updateState(1, { state: 'open' });

      // Assert
      expect(doorsLockOutService.isLockedOut).toHaveBeenCalledWith(1);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).toHaveBeenCalledTimes(2);
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(1, 'opening', {
        doorId: 1,
      });
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(
        2,
        'open',
        { doorId: 1 },
        { delay: 20_000 },
      );

      expect(doorsSequenceRunQueue.add).toHaveBeenCalledWith('open', {
        doorId: 1,
      });

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should toggle doors state from open to closed', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
        openDuration: 20_000,
        closeDuration: 20_000,
      } as Door);

      // Act
      await controller.updateState(1, { state: 'toggle' });

      // Assert
      expect(doorsLockOutService);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).toHaveBeenCalledTimes(2);
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(1, 'closing', {
        doorId: 1,
      });
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(
        2,
        'closed',
        { doorId: 1 },
        { delay: 20000 },
      );
      expect(doorsSequenceRunQueue.add).toHaveBeenCalledWith('close', {
        doorId: 1,
      });

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should toggle doors state from closed to open', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
        openDuration: 20_000,
        closeDuration: 20_000,
      } as Door);

      // Act
      await controller.updateState(1, { state: 'toggle' });

      // Assert
      expect(doorsLockOutService.isLockedOut).toHaveBeenCalledWith(1);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).toHaveBeenCalledTimes(2);
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(1, 'opening', {
        doorId: 1,
      });
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(
        2,
        'open',
        { doorId: 1 },
        { delay: 20000 },
      );
      expect(doorsSequenceRunQueue.add).toHaveBeenCalledWith('open', {
        doorId: 1,
      });

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should update state to closed from open', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
        openDuration: 20_000,
        closeDuration: 20_000,
      } as Door);

      // Act
      await controller.updateState(1, { state: 'close' });

      // Assert
      expect(doorsLockOutService.isLockedOut).toHaveBeenCalledWith(1);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).toHaveBeenCalledTimes(2);
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(1, 'closing', {
        doorId: 1,
      });
      expect(doorsStateUpdateQueue.add).toHaveBeenNthCalledWith(
        2,
        'closed',
        { doorId: 1 },
        { delay: 20000 },
      );
      expect(doorsSequenceRunQueue.add).toHaveBeenCalledWith('close', {
        doorId: 1,
      });

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should reject opening an open door', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'open',
      } as Door);

      // Act
      await expect(
        controller.updateState(1, { state: 'open' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot open an open/opening door',
      });

      // Assert
      expect(doorsLockOutService.isLockedOut).toHaveBeenCalledWith(1);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).toHaveBeenCalledTimes(0);
      expect(doorsSequenceRunQueue.add).not.toHaveBeenCalled();

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should reject opening an opening door', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'opening',
      } as Door);

      // Act
      await expect(
        controller.updateState(1, { state: 'open' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot open an open/opening door',
      });

      // Assert
      expect(doorsLockOutService.isLockedOut).toHaveBeenCalledWith(1);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).not.toHaveBeenCalled();
      expect(doorsSequenceRunQueue.add).not.toHaveBeenCalled();

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should reject closing a closed door', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closed',
      } as Door);

      // Act
      await expect(
        controller.updateState(1, { state: 'close' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot close a closed/closing door',
      });

      // Assert
      expect(doorsLockOutService.isLockedOut).toHaveBeenCalledWith(1);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).toHaveBeenCalledTimes(0);
      expect(doorsSequenceRunQueue.add).not.toHaveBeenCalled();

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });

    it('should reject closing a closing door', async () => {
      // Arrange
      doorsService.findOne.mockResolvedValue({
        id: 1,
        isEnabled: true,
        label: 'door1',
        state: 'closing',
      } as Door);

      // Act
      await expect(
        controller.updateState(1, { state: 'close' }),
      ).rejects.toMatchObject({
        constructor: BadRequestException,
        message: 'Cannot close a closed/closing door',
      });

      // Assert
      expect(doorsLockOutService.isLockedOut).toHaveBeenCalledWith(1);
      expect(doorsService.findOne).toHaveBeenCalledWith(1);

      expect(doorsStateUpdateQueue.add).not.toHaveBeenCalled();
      expect(doorsSequenceRunQueue.add).not.toHaveBeenCalled();

      expect(automationHatService.turnOnCommsLight).toHaveBeenCalled();
      expect(automationHatService.turnOffCommsLight).toHaveBeenCalled();
    });
  });
});
