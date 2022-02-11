import {
  Controller,
  Param,
  Put,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiKeyAuthGuard } from '../auth/api-key-auth.guard';
import { AutomationHatService } from '../automation-hat/automation-hat.service';

@Controller('api/v1/doors')
@UseGuards(ApiKeyAuthGuard)
export class DoorsController {
  constructor(private readonly automationHatService: AutomationHatService) {}

  // @Put()
  // updateAll(@Body() updateAllDto: UpdateAllDoorsDto) {
  //   return this.autom.create(createDoorDto);
  // }

  // @Get()
  // findAll() {
  //   return this.doorsService.findAll();
  // }

  // @Get(':doorNumber')
  // findOne(@Param('doorNumber') doorNumber: string) {
  //   return this.doorsService.findOne(+doorNumber);
  // }

  @Put(':doorNumber')
  update(
    @Param('doorNumber', ParseIntPipe) doorNumber: number,
    // @Body() updateDoorDto: UpdateDoorDto,
  ) {
    switch (doorNumber) {
      case 1:
        this.automationHatService.automationHat.relays.relay1.toggle();
        break;

      case 2:
        this.automationHatService.automationHat.relays.relay2.toggle();
        break;

      case 3:
        this.automationHatService.automationHat.relays.relay3.toggle();
        break;

      default:
        throw new BadRequestException('Invalid Door Number');
    }
  }
}
