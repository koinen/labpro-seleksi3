import { PartialType } from '@nestjs/swagger';
import { CreateModuleRequestDto } from './create-module-request.dto';

export class UpdateModuleDto extends PartialType(CreateModuleRequestDto) {}
