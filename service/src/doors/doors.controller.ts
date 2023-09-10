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
  LoggerService,
  ConsoleLogger,
  ConflictException,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { differenceInMilliseconds } from 'date-fns';
import { HttpApiKeyAuthGuard } from '../auth/http-api-key-auth.guard';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { HttpClientVersionGuard } from '../client-version/http-client-version.guard';
import { SequenceObject } from '../entities/SequenceObject.entity';
import { DoorsService } from './doors.service';
import { GetDoorDto } from './dto/get-door.dto';
import { SequenceObjectDto } from './dto/sequence-object.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@UseGuards(HttpClientVersionGuard, HttpApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('api/v1/doors')
export class DoorsController {
  #logger: LoggerService;

  constructor(
    private readonly doorsService: DoorsService,
    private readonly automationHatService: AutomationHatService,
  ) {
    this.#logger = new ConsoleLogger(DoorsController.name);
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
      this.#logger.warn('Invalid door id');
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
      this.#logger.warn('Invalid door id');
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
      this.#logger.warn('Invalid door id');
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
      this.#logger.warn('Invalid door id');
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
        this.#logger.warn(msg);
        throw new BadRequestException(msg);
      }

      if (
        dto.target.startsWith('digitalOutput') &&
        ['off', 'on'].includes(dto.action)
      ) {
        this.automationHatService.turnOffCommsLight();
        const msg = `Invalid action ${dto.action} for target ${dto.target}`;
        this.#logger.warn(msg);
        throw new BadRequestException(msg);
      }
    });

    if (body.some((x) => x.duration < 0)) {
      this.automationHatService.turnOffCommsLight();
      this.#logger.warn('Duration cannot be negative');
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
      this.#logger.warn('Invalid door id');
      throw new BadRequestException('Invalid Door id');
    }

    const door = await this.doorsService.findOne(id);

    // don't process any requests if the last update time was less than 1 second ago
    if (differenceInMilliseconds(new Date(), door.updatedAt) < 1000) {
      this.automationHatService.turnOffCommsLight();
      throw new ConflictException(
        'Cannot change door state faster than 1 second',
      );
    }

    // don't process any requests when we are opening/closing the doors
    if (door.state === 'closing' || door.state === 'opening') {
      this.automationHatService.turnOffCommsLight();
      this.#logger.warn('Door state currently changing');
      throw new ConflictException('Door state currently changing');
    }

    // don't open the door if it's already open
    if (door.state === 'open' && body.state === 'open') {
      this.automationHatService.turnOffCommsLight();
      return;
    }

    // don't close the door if it's already closed
    if (door.state === 'closed' && body.state === 'close') {
      this.automationHatService.turnOffCommsLight();
      return;
    }

    switch (body.state) {
      case 'close':
        await this.doorsService.close(id);
        break;
      case 'open':
        await this.doorsService.open(id);
        break;
      case 'toggle':
        await this.doorsService.toggle(id);
        break;
      default:
        this.automationHatService.turnOffCommsLight();
        this.#logger.warn(`Invalid state ${body.state}`);
        throw new BadRequestException('Invalid state');
    }

    this.automationHatService.turnOffCommsLight();
  }
}
