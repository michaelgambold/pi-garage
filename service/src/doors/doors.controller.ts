import {
  Controller,
  Param,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  Post,
  Get,
  Body,
  Put,
  ConflictException,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { HttpApiKeyAuthGuard } from '../auth/http-api-key-auth.guard';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { HttpClientVersionGuard } from '../client-version/http-client-version.guard';
import { SequenceObject } from '../entities/SequenceObject.entity';
import { DoorsService } from './doors.service';
import { GetDoorDto } from './dto/get-door.dto';
import { SequenceObjectDto } from './dto/sequence-object.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import {
  DoorQueue,
  DoorSequenceJobName,
  DoorStateJobName,
  DoorsSequenceJobData,
  DoorsStateJobData,
} from './types';
import { Logger } from '../logger/logger';
import { Door } from '../entities/Door.entity';
import { DoorsLockOutService } from './doors-lock-out.service';

@ApiSecurity('api-key')
@ApiTags('Doors')
@UseGuards(HttpClientVersionGuard, HttpApiKeyAuthGuard)
@Controller('api/v1/doors')
export class DoorsController {
  private readonly logger: Logger;

  constructor(
    private readonly doorsService: DoorsService,
    private readonly automationHatService: AutomationHatService,
    @InjectQueue(DoorQueue.DOORS_SEQUENCE_RUN)
    private readonly doorsSequenceRunQueue: Queue,
    @InjectQueue(DoorQueue.DOORS_STATE_UPDATE)
    private readonly doorsStateUpdateQueue: Queue,
    private readonly doorsLockService: DoorsLockOutService,
  ) {
    this.logger = new Logger(DoorsController.name);
  }

  @ApiOkResponse({
    type: GetDoorDto,
    isArray: true,
    example: [
      {
        id: 1,
        label: 'Door 1',
        isEnabled: true,
        state: 'open',
        openDuration: 20000,
        closeDuration: 20000,
      },
      {
        id: 2,
        label: 'Door 2',
        isEnabled: true,
        state: 'closed',
        openDuration: 20000,
        closeDuration: 20000,
      },
      {
        id: 3,
        label: 'Door 3',
        isEnabled: false,
        state: 'closed',
        openDuration: 20000,
        closeDuration: 20000,
      },
    ],
  })
  @Get()
  async getAll(): Promise<GetDoorDto[]> {
    this.automationHatService.turnOnCommsLight();

    const doors = await this.doorsService.findAll();

    this.automationHatService.turnOffCommsLight();

    return doors.map((d) => {
      return {
        id: d.id,
        label: d.label,
        isEnabled: d.isEnabled,
        state: d.state,
        openDuration: d.openDuration,
        closeDuration: d.closeDuration,
      };
    });
  }

  @ApiOkResponse({
    type: GetDoorDto,
    example: {
      id: 1,
      label: 'Door 1',
      isEnabled: true,
      state: 'open',
      openDuration: 20000,
      closeDuration: 20000,
    },
  })
  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<GetDoorDto> {
    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
      this.logger.warn('Invalid door id');
      throw new BadRequestException('Invalid door id');
    }

    const door = await this.doorsService.findOne(id);

    this.automationHatService.turnOffCommsLight();

    return {
      id: door.id,
      label: door.label,
      isEnabled: door.isEnabled,
      state: door.state,
      openDuration: door.openDuration,
      closeDuration: door.closeDuration,
    };
  }

  @ApiOkResponse({
    type: SequenceObjectDto,
    isArray: true,
    example: [
      {
        action: 'on',
        duration: 1000,
        target: 'relay1',
      },
      {
        action: 'off',
        duration: 1000,
        target: 'relay1',
      },
    ],
  })
  @Get(':id/sequence')
  async getSequence(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SequenceObjectDto[]> {
    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
      this.logger.warn('Invalid door id');
      throw new BadRequestException('Invalid door id');
    }

    const door = await this.doorsService.findOne(id);
    await door.sequence.init();

    this.automationHatService.turnOffCommsLight();

    return door.sequence.getItems().map((d) => ({
      action: d.action,
      duration: d.duration,
      target: d.target,
    }));
  }

  @ApiBody({
    type: UpdateDoorDto,
    examples: {
      'Update Door': {
        value: {
          label: 'Door 1',
          isEnabled: true,
          openDuration: 20000,
          closeDuration: 20000,
        },
      },
    },
  })
  @ApiOkResponse({ type: null })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDoorDto,
  ): Promise<void> {
    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
      this.logger.warn('Invalid door id');
      throw new BadRequestException('Invalid Door id');
    }

    const door = await this.doorsService.findOne(id);
    door.isEnabled = body.isEnabled;
    door.label = body.label;
    door.closeDuration = body.closeDuration;
    door.openDuration = body.openDuration;

    await this.doorsService.update(door);

    this.automationHatService.turnOffCommsLight();
  }

  @ApiBody({
    type: [SequenceObjectDto],
    examples: {
      'Update Sequence': {
        value: [
          { action: 'on', duration: 1000, target: 'relay1' },
          { action: 'off', duration: 1000, target: 'relay1' },
        ],
      },
    },
  })
  @ApiOkResponse({ type: null })
  @Put(':id/sequence')
  async updateSequence(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SequenceObjectDto[],
  ): Promise<void> {
    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
      this.logger.warn('Invalid door id');
      throw new BadRequestException('Invalid Door id');
    }

    // check invalid action/target combos passed
    body.forEach((dto) => {
      if (
        dto.target.startsWith('relay') &&
        ['low', 'high'].includes(dto.action)
      ) {
        this.automationHatService.turnOffCommsLight();
        const msg = `Invalid action ${dto.action} for target ${dto.target}`;
        this.logger.warn(msg);
        throw new BadRequestException(msg);
      }

      if (
        dto.target.startsWith('digitalOutput') &&
        ['off', 'on'].includes(dto.action)
      ) {
        this.automationHatService.turnOffCommsLight();
        const msg = `Invalid action ${dto.action} for target ${dto.target}`;
        this.logger.warn(msg);
        throw new BadRequestException(msg);
      }
    });

    if (body.some((x) => x.duration < 0)) {
      this.automationHatService.turnOffCommsLight();
      this.logger.warn('Duration cannot be negative');
      throw new BadRequestException('Duration cannot be negative');
    }

    const door = await this.doorsService.findOne(id);
    await door.sequence.init();
    const sequence = door.sequence.getItems();

    // remove sequences if we have more in the DB than the DTO
    while (sequence.length > body.length) {
      sequence.pop();
    }

    body.forEach((dto, index) => {
      let sequenceObject = sequence[index];

      if (!sequenceObject) {
        sequenceObject = new SequenceObject();
        sequence.push(sequenceObject);
      }

      sequenceObject.action = dto.action;
      sequenceObject.door = door;
      sequenceObject.duration = dto.duration;
      sequenceObject.index = index;
      sequenceObject.target = dto.target;
    });

    door.sequence.set(sequence);
    await this.doorsService.update(door);

    this.automationHatService.turnOffCommsLight();
  }

  @ApiBody({
    type: UpdateStateDto,
    examples: { 'Update State': { value: { state: 'open' } } },
  })
  @ApiOkResponse({ type: null })
  @Post(':id/state')
  async updateState(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStateDto,
  ): Promise<void> {
    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
      this.logger.warn('Invalid door id');
      throw new BadRequestException('Invalid Door id');
    }

    const doorLockedOut = await this.doorsLockService.isLockedOut(id);
    if (doorLockedOut) {
      this.automationHatService.turnOffCommsLight();
      throw new ConflictException('Door changing state is locked out');
    }

    const door = await this.doorsService.findOne(id);

    // Handle open door
    if (body.state === 'open') {
      if (door.state === 'open' || door.state === 'opening') {
        this.automationHatService.turnOffCommsLight();
        throw new BadRequestException('Cannot open an open/opening door');
      }

      await this.emitOpenMesages(door);
      this.automationHatService.turnOffCommsLight();
      return;
    }

    // Handle close door
    if (body.state === 'close') {
      if (door.state === 'closed' || door.state === 'closing') {
        this.automationHatService.turnOffCommsLight();
        throw new BadRequestException('Cannot close a closed/closing door');
      }

      await this.emitCloseMessages(door);
      this.automationHatService.turnOffCommsLight();
      return;
    }

    // Handle toggle door
    if (body.state === 'toggle') {
      if (door.state === 'closed' || door.state === 'closing') {
        await this.emitOpenMesages(door);
      } else if (door.state === 'open' || door.state === 'opening') {
        await this.emitCloseMessages(door);
      }
      this.automationHatService.turnOffCommsLight();
      return;
    }

    this.logger.warn(`Invalid state ${body.state}`);
    this.automationHatService.turnOffCommsLight();
    throw new BadRequestException('Invalid state');
  }

  private async emitCloseMessages(door: Door) {
    await this.doorsStateUpdateQueue.add(DoorStateJobName.CLOSING, {
      doorId: door.id,
    } as DoorsStateJobData);
    this.logger.log(
      `Added ${DoorStateJobName.CLOSING} job for door ${door.id} to door state queue`,
    );

    await this.doorsStateUpdateQueue.add(
      DoorStateJobName.CLOSED,
      { doorId: door.id } as DoorsStateJobData,
      { delay: door.closeDuration },
    );
    this.logger.log(
      `Added ${DoorStateJobName.CLOSED} job for door ${door.id} to door state queue`,
    );

    await this.doorsSequenceRunQueue.add(DoorSequenceJobName.CLOSE, {
      doorId: door.id,
    } as DoorsSequenceJobData);
    this.logger.log(
      `Added ${DoorSequenceJobName.CLOSE} job for door ${door.id} to door sequence run queue`,
    );
  }

  private async emitOpenMesages(door: Door) {
    await this.doorsStateUpdateQueue.add(DoorStateJobName.OPENING, {
      doorId: door.id,
    } as DoorsStateJobData);
    this.logger.log(
      `Added ${DoorStateJobName.OPENING} job for door ${door.id} to door state queue`,
    );

    await this.doorsStateUpdateQueue.add(
      DoorStateJobName.OPEN,
      { doorId: door.id } as DoorsStateJobData,
      { delay: door.openDuration },
    );
    this.logger.log(
      `Added ${DoorStateJobName.OPEN} job for door ${door.id} to door state queue`,
    );

    await this.doorsSequenceRunQueue.add(DoorSequenceJobName.OPEN, {
      doorId: door.id,
    } as DoorsSequenceJobData);
    this.logger.log(
      `Added ${DoorSequenceJobName.OPEN} job for door ${door.id} to door sequence run queue`,
    );
  }
}
