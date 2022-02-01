import { PartialType } from '@nestjs/mapped-types';
import { UpdateAllDoorsDto } from './update-all-doors.dto';

export class UpdateDoorDto extends PartialType(UpdateAllDoorsDto) {}
