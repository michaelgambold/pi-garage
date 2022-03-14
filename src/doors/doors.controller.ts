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
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { AutomationHatService } from '../automation-hat/automation-hat.service';
import { SequenceObject } from '../entities/SequenceObject.entity';
import { DoorsService } from './doors.service';
import { GetDoorDto } from './dto/get-door.dto';
import { SequenceObjectDto } from './dto/sequence-object.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@UseGuards(ApiKeyAuthGuard)
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

  @Get()
  async getAll(): Promise<GetDoorDto[]> {
    this.#logger.log('GET /api/v1/doors invoked');

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

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number): Promise<GetDoorDto> {
    this.#logger.log(`GET /api/v1/doors/${id} invoked`);

    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
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
    this.#logger.log(`GET /api/v1/doors/${id}/sequence invoked`);

    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
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
    this.#logger.log(`PUT /api/v1/doors/${id} invoked`);

    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
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
    this.#logger.log(`PUT /api/v1/doors/${id}/sequence invoked`);

    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      this.automationHatService.turnOffCommsLight();
      throw new BadRequestException('Invalid Door id');
    }

    // check invalid action/target combos passed
    body.forEach((dto) => {
      if (
        dto.target.startsWith('relay') &&
        ['low', 'high'].includes(dto.action)
      ) {
        this.automationHatService.turnOffCommsLight();
        throw new BadRequestException(
          `Invalid action ${dto.action} for target ${dto.target}`,
        );
      }

      if (
        dto.target.startsWith('digitalOutput') &&
        ['off', 'on'].includes(dto.action)
      ) {
        this.automationHatService.turnOffCommsLight();
        throw new BadRequestException(
          `Invalid action ${dto.action} for target ${dto.target}`,
        );
      }
    });

    if (body.some((x) => x.duration < 0)) {
      this.automationHatService.turnOffCommsLight();
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
    this.#logger.log(`PATCH /api/v1/doors/${id}/state invoked`);

    this.automationHatService.turnOnCommsLight();

    if (![1, 2, 3].includes(id)) {
      throw new BadRequestException('Invalid Door id');
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
        throw new BadRequestException('Invalid state');
    }

    this.automationHatService.turnOffCommsLight();
  }
}
