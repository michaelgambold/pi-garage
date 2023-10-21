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
  // ConflictException,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
// import { differenceInMilliseconds } from 'date-fns';
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

@UseGuards(HttpClientVersionGuard, HttpApiKeyAuthGuard)
@ApiSecurity('api-key')
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
  ) {
    this.logger = new Logger(DoorsController.name);
  }

  @ApiResponse({ type: GetDoorDto, isArray: true, status: 200 })
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
      };
    });
  }

  @ApiResponse({ type: GetDoorDto, status: 200 })
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
    };
  }

  @ApiResponse({ status: 200, type: SequenceObjectDto, isArray: true })
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

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDoorDto,
  ) {
    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
      this.logger.warn('Invalid door id');
      throw new BadRequestException('Invalid Door id');
    }

    const door = await this.doorsService.findOne(id);
    door.isEnabled = body.isEnabled;
    door.label = body.label;

    await this.doorsService.update(door);

    this.automationHatService.turnOffCommsLight();
  }

  @ApiBody({ type: [SequenceObjectDto] })
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

    // TODO: check if door is currently locked out in redis. i.e. is it
    // currently running a sequence and if so then return bad request.
    // The implication is that you will not be able to push the button
    // whilst this is happening unless we do something where you can "cancel"
    // a current sequence but sequences now should only be 2 seconds or so,
    // so it maybe not an issue and the lockout is okay being a short duration.

    const door = await this.doorsService.findOne(id);

    // const client = await this.doorsSequenceRunQueue.client;

    // Handle open door
    if (body.state === 'open') {
      if (door.state === 'open' || door.state === 'opening') {
        this.automationHatService.turnOffCommsLight();
        throw new BadRequestException('Cannot open an open/opening door');
      }

      await this.emitOpenMesages(id);
      this.automationHatService.turnOffCommsLight();
      return;
    }

    // Handle close door
    if (body.state === 'close') {
      if (door.state === 'closed' || door.state === 'closing') {
        this.automationHatService.turnOffCommsLight();
        throw new BadRequestException('Cannot close a closed/closing door');
      }

      await this.emitCloseMessages(id);
      this.automationHatService.turnOffCommsLight();
      return;
    }

    // Handle toggle door
    if (body.state === 'toggle') {
      if (door.state === 'closed' || door.state === 'closing') {
        await this.emitOpenMesages(id);
      } else if (door.state === 'open' || door.state === 'opening') {
        await this.emitCloseMessages(id);
      }
      this.automationHatService.turnOffCommsLight();
      return;
    }

    this.logger.warn(`Invalid state ${body.state}`);
    this.automationHatService.turnOffCommsLight();
    throw new BadRequestException('Invalid state');
  }

  private async emitCloseMessages(doorId: number) {
    await this.doorsStateUpdateQueue.add(DoorStateJobName.CLOSING, {
      doorId,
    } as DoorsStateJobData);

    await this.doorsStateUpdateQueue.add(
      DoorStateJobName.CLOSED,
      { doorId } as DoorsStateJobData,
      { delay: 20_000 },
    );

    await this.doorsSequenceRunQueue.add(DoorSequenceJobName.CLOSE, {
      doorId,
    } as DoorsSequenceJobData);
  }

  private async emitOpenMesages(doorId: number) {
    await this.doorsStateUpdateQueue.add(DoorStateJobName.OPENING, {
      doorId,
    } as DoorsStateJobData);

    await this.doorsStateUpdateQueue.add(
      DoorStateJobName.OPEN,
      { doorId } as DoorsStateJobData,
      { delay: 20_000 },
    );

    await this.doorsSequenceRunQueue.add(DoorSequenceJobName.OPEN, {
      doorId,
    } as DoorsSequenceJobData);
  }
}
