import {
  Controller,
  Param,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
  Patch,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { ApiSecurity } from '@nestjs/swagger';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { DoorsService } from './doors.service';
import { GetAllDoorsDto } from './dto/get-all-doors.dto';
import { GetDoorDto } from './dto/get-door.dto';
import { UpdateAllDoorsDto } from './dto/update-all-doors.dto';
import { UpdateDoorDto } from './dto/update-door.dto';
import { Door } from './models/door';

@UseGuards(ApiKeyAuthGuard)
@ApiSecurity('api-key')
@Controller('api/v1/doors')
export class DoorsController {
  constructor(private readonly doorsService: DoorsService) {}

  @Get()
  getAll(): GetAllDoorsDto[] {
    return [
      {
        door: 1,
        state: this.doorsService.door1.state,
      },
      {
        door: 2,
        state: this.doorsService.door2.state,
      },
      {
        door: 3,
        state: this.doorsService.door3.state,
      },
    ];
  }

  @Get(':doorNumber')
  get(@Param('doorNumber', ParseIntPipe) doorNumber: number): GetDoorDto {
    let door: Door;

    switch (doorNumber) {
      case 1:
        door = this.doorsService.door1;
        break;
      case 2:
        door = this.doorsService.door2;
        break;
      case 3:
        door = this.doorsService.door3;
        break;
      default:
        throw new BadRequestException('Invalid door number');
    }

    return {
      state: door.state,
    };
  }

  @Post()
  updateAll(@Body() body: UpdateAllDoorsDto[]) {
    if (!body.every((dto) => [1, 2, 3].includes(dto.door))) {
      throw new BadRequestException('Invalid door number');
    }

    body.forEach((dto) => {
      this.doorsService.update(dto.door, dto.action);
    });
  }

  @Patch(':doorNumber')
  update(
    @Param('doorNumber', ParseIntPipe) doorNumber: number,
    @Body() body: UpdateDoorDto,
    // @Body() updateDoorDto: UpdateDoorDto,
  ) {
    // check for door number
    if (![1, 2, 3].includes(doorNumber)) {
      throw new BadRequestException('Invalid Door Number');
    }

    this.doorsService.update(doorNumber, body.action);
  }
}
