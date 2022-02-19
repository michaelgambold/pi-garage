import {
  Controller,
  Param,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  Patch,
  Get,
  Body,
  Put,
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
  constructor(private readonly doorsService: DoorsService) {}

  @Get()
  async getAll(): Promise<GetDoorDto[]> {
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
    if (![1, 2, 3].includes(id)) {
      throw new BadRequestException('Invalid Door id');
    }

    const door = await this.doorsService.findOne(id);
    door.isEnabled = body.isEnabled;
    door.label = body.label;

    await this.doorsService.update(door);
  }

  @Patch(':id/state')
  async updateState(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateStateDto,
  ): Promise<void> {
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
