import { Controller, Get, Param, Delete, UseGuards, UseInterceptors, UploadedFiles, Put, Body, ForbiddenException, Patch } from '@nestjs/common';
import { ModuleService } from './module.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { createSwaggerResponse } from 'src/common/response/swagger-response-factory';
import { CreateModuleResponseDto } from './dto/response/create-module-response.dto';
import { SuccessResponseBuilder } from 'src/common/response/response-builder';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateModuleRequestDto } from './dto/request/create-module-request.dto';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { ModuleResponseDto } from './dto/response/get-modules-response.dto';

@UseGuards(AuthGuard)
@Controller('api/module')
export class ModuleController {
	constructor( private readonly moduleService: ModuleService) {}

	@Get(':id')
	@ApiOperation({ summary: 'Get a module by ID and user progress' })
	@ApiOkResponse({ type: createSwaggerResponse(ModuleResponseDto) })
	async findOne(@Param('id') id: string) {
		const module = await this.moduleService.module(id);
		return new SuccessResponseBuilder()
			.setData(module)
			.build();
	}
	
	@Put(':id')
	@UseInterceptors(
		FileFieldsInterceptor([
				{ name: 'pdf_content', maxCount: 1 },
				{ name: 'video_content', maxCount: 1 },
			],
			{
				storage: diskStorage({
					destination: './uploads',
					filename: (req, file, cb) => {
						const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
						cb(null, file.fieldname + '-' + unique + '.' + file.originalname.split('.').pop());
					}
				})
			}
		),
	)
	@ApiOperation({ summary: 'Update a module' })
	@ApiOkResponse({ type: createSwaggerResponse(CreateModuleResponseDto), description: 'Module updated successfully' })
	async updateModule(
		@Param('id') id: string,
		@UploadedFiles()
		files: {
			pdf_content?: Express.Multer.File[];
			video_content?: Express.Multer.File[];
		},
		@Body() dto: CreateModuleRequestDto,
		@User() req: JwtPayload,
	) {
		if (!req.is_admin) throw new ForbiddenException('You do not have permission to update modules');
		
		const pdf = files.pdf_content?.[0]?.filename;
		const video = files.video_content?.[0]?.filename;
		const module = await this.moduleService.update(id, dto, {
			pdf_content: pdf,
			video_content: video
		});

		return new SuccessResponseBuilder()
			.setData(module)
			.build();
	}
	
	@Delete(':id')
	@ApiOperation({ summary: 'Delete a module by ID' })
	@ApiOkResponse({ description: 'Module deleted successfully' })
	async remove(
		@Param('id') id: string, 
		@User() req: JwtPayload
	) {
		if (!req.is_admin) throw new ForbiddenException('You do not have permission to delete modules');
		await this.moduleService.remove(id);
		return { message: "Module deleted successfully" };
	}

	@Patch(':id/complete')
	@ApiOperation( { summary: 'Mark a module as complete' } )
	@ApiOkResponse({ description: 'Module marked as complete successfully' })
	async completeModule(@Param('id') id: string, @User() req: JwtPayload) {
		const progress = await this.moduleService.complete(id, req.sub);
		return new SuccessResponseBuilder()
			.setData(progress)
			.build();
	}

	@Patch(':id/not-complete')
	@ApiOperation( { summary: 'Mark a module as not completed' } )
	@ApiOkResponse({ description: 'Module marked incomplete successfully' })
	async notCompleteModule(@Param('id') id: string, @User() req: JwtPayload) {
		const progress = await this.moduleService.complete(id, req.sub, false);
		return new SuccessResponseBuilder()
			.setData(progress)
			.build();
	}
}
