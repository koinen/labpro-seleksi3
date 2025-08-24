import { Controller, Get, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Put, Body, ForbiddenException, Patch, HttpCode, HttpStatus, Render } from '@nestjs/common';
import { ModuleService } from './module.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SuccessResponseBuilder } from 'src/common/response/response-builder';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@UseGuards(AuthGuard)
@Controller('api/modules')
export class ModulePageController {
	constructor( private readonly moduleService: ModuleService) {}

	@Get(':id')
	@Render('module')
	async findOne(@Param('id') id: string) {
		const module = await this.moduleService.module(id);
		return new SuccessResponseBuilder()
			.setData(module)
			.build();
	}
}
