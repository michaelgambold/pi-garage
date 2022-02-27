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
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { DoorsService } from './doors.service';
import { GetDoorDto } from './dto/get-door.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { UpdateStateDto } from './dto/update-state.dto';

@UseGuards(ApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('api/v1/doors')
export class DoorsController {
  #logger: LoggerService;

  constructor(private readonly doorsService: DoorsService) {
    this.#logger = new ConsoleLogger(DoorsController.name);
  }

  @Get()
  async getAll(): Promise<GetDoorDto[]> {
    this.#logger.log('GET /api/v1/doors invoked');

    const doors = await this.doorsService.findAll();

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

    if (![1, 2, 3].includes(id)) {
      throw new BadRequestException('Invalid door id');
    }

    const door = await this.doorsService.findOne(id);

    return {
      id: door.id,
      label: door.label,
      isEnabled: door.isEnabled,
      state: door.state,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDoorDto,
    // @Body() updateDoorDto: UpdateDoorDto,
  ) {
    this.#logger.log(`PUT /api/v1/doors/${id} invoked`);

    if (![1, 2, 3].includes(id)) {
      throw new BadRequestException('Invalid Door id');
    }

    const door = await this.doorsService.findOne(id);
    door.isEnabled = body.isEnabled;
    door.label = body.label;

    await this.doorsService.update(door);
  }

  @Post(':id/state')
  async updateState(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStateDto,
  ): Promise<void> {
    this.#logger.log(`PATCH /api/v1/doors/${id}/state invoked`);

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
  }
}
