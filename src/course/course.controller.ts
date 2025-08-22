import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query, UseGuards, Put, ForbiddenException, UploadedFiles } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseRequestDto } from './dto/request/create-course-request.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { CourseResponseDto } from './dto/response/course-response.dto';
import { createSwaggerResponse, createSwaggerResponseWithPagination } from 'src/common/response/swagger-response-factory';
import { CourseSummary } from './dto/response/get-courses-response.dto';
import { UpdateCourseRequestDto } from './dto/request/update-course-request.dto';
import { User } from 'src/common/decorators/user.decorator';
import { SuccessResponseBuilder } from 'src/common/response/response-builder';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { BuyCourseResponse } from './dto/response/buy-course-response.dto';
import { diskStorage } from 'multer';
import { CreateModuleRequestDto } from 'src/module/dto/request/create-module-request.dto';
import { ModuleService } from 'src/module/module.service';
import { CreateModuleResponseDto } from 'src/module/dto/response/create-module-response.dto';
import { ReorderModulesDto } from 'src/module/dto/reorder-modules.dto';
import { GetModulesResponse, ModuleResponseDto } from 'src/module/dto/response/get-modules-response.dto';

@UseGuards(AuthGuard)
@Controller('api/courses')
export class CourseController {
  	constructor(
		private readonly courseService: CourseService,
		private readonly moduleService: ModuleService,
	) {}

	@Post()
	@UseInterceptors(
		FileInterceptor('thumbnail_image', {
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, cb) => {
					const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
					cb(null, file.fieldname + '-' + unique + '.' + file.originalname.split('.').pop());
				}
			})
		}),
	)
	@ApiOperation({ summary: 'Create a new course' })
	@ApiOkResponse({ type: createSwaggerResponse(CourseResponseDto), description: 'Course created successfully' })
	async create(
		@Body() dto: CreateCourseRequestDto,
		@UploadedFile() thumbnail_image: Express.Multer.File,
		@User() req: JwtPayload,
	) {
		if (!req.is_admin) throw new ForbiddenException('You do not have permission to create courses');
		const fileName = thumbnail_image.filename;
		const course = await this.courseService.create(dto, fileName);
		return new SuccessResponseBuilder()
			.setData(course)
			.build();
	}

	@Get()
	@ApiOperation({ summary: 'Get all courses with optional search and pagination' })
	@ApiOkResponse({ type: createSwaggerResponseWithPagination(CourseSummary), description: 'Courses retrieved successfully' })
	async findAll(
		@Query() query: PaginationQueryDto
	) {
		const { courses, total } = await this.courseService.courses(query);

		return new SuccessResponseBuilder()
			.setData(courses)
			.setPagination({
				current_page: query.page,
				total_pages: Math.ceil(total / query.limit),
				total_items: total
			})
			.build();
	}

	@Get('my-courses')
	@ApiOperation( { summary: 'Get my courses' } )
	@ApiOkResponse( { type: createSwaggerResponseWithPagination(CourseSummary), description: 'My courses retrieved successfully' } )
	async findMyCourses(
		@Query() query: PaginationQueryDto,
		@User() req: JwtPayload
	) {
		const courses = await this.courseService.myCourses(req.sub, query);
		return new SuccessResponseBuilder()
			.setData(courses)
			.setPagination({
				current_page: query.page,
				total_pages: Math.ceil(courses.total / query.limit),
				total_items: courses.total
			})
			.build();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a course by ID' })
	@ApiOkResponse({ type: createSwaggerResponse(CourseSummary), description: 'Course retrieved successfully' })
	async findOne(@Param('id') id: string) {
		const course = await this.courseService.course(id);
		return new SuccessResponseBuilder()
			.setData(course)
			.build();
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update a course by ID' })
	@ApiOkResponse({ type: createSwaggerResponse(CourseResponseDto), description: 'Course updated successfully' })
	async update(
		@Param('id') id: string, 
		@Body() updateCourseDto: UpdateCourseRequestDto,
		@UploadedFile() thumbnail_image: Express.Multer.File | undefined,
		@User() req: JwtPayload
	) {
		if (!req.is_admin) throw new ForbiddenException('You do not have permission to update courses');
		const updatedCourse = await this.courseService.update(id, updateCourseDto, thumbnail_image);
		return new SuccessResponseBuilder()
			.setData(updatedCourse)
			.build();
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a course by ID' })
	@ApiOkResponse({ description: 'Course deleted successfully' })
	async remove(
		@Param('id') id: string, 
		@User() req: JwtPayload
	) {
		if (!req.is_admin) throw new ForbiddenException('You do not have permission to delete courses');
		await this.courseService.remove(id);
	}

	@Post(':id/buy')
	@ApiOperation( { summary: 'Buy a course by ID' } )
	@ApiOkResponse( { type: createSwaggerResponse(BuyCourseResponse), description: 'Course purchased successfully',  } )
	async buyCourse(
		@Param('id') id: string,
		@User() req: JwtPayload
	) {
		const purchaseDetails = await this.courseService.buyCourse(id, req.sub);
		return new SuccessResponseBuilder()
			.setData(purchaseDetails)
			.build();
	}

  	@Post(':id/modules')
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
	@ApiOperation({ summary: 'Create a new module for a course' })
	@ApiOkResponse({ type: createSwaggerResponse(CreateModuleResponseDto), description: 'Module created successfully' })
	async createModule(
		@Param('id') courseId: string,
		@UploadedFiles()
		files: {
			pdf_content?: Express.Multer.File[];
			video_content?: Express.Multer.File[];
		},
		@Body() dto: CreateModuleRequestDto,
		@User() req: JwtPayload,
	) {
		if (!req.is_admin) throw new ForbiddenException('You do not have permission to create modules');

		const pdf = files.pdf_content?.[0]?.filename;
		const video = files.video_content?.[0]?.filename;
		const module = await this.moduleService.create(dto, {
			course_id: courseId,
			pdf_content: pdf,
			video_content: video
		});

		return new SuccessResponseBuilder()
			.setData(module)
			.build();
	}

  	@Get(':id/modules')
  	@ApiOperation({ summary: 'Get all modules for a course' })
  	@ApiOkResponse({ type: createSwaggerResponse(GetModulesResponse), description: 'Modules retrieved successfully' })
	async getModules(
		@Param('id') course_id: string,
		@Query() query: PaginationQueryDto,
		@User() req: JwtPayload
	) {
		const { page, limit } = query;
		const { modules, total } = await this.moduleService.modules({
			user_id: req.sub,
			course_id,
			page,
			limit,
		});
		return new SuccessResponseBuilder()
			.setData(modules)
			.setPagination({
				current_page: page,
				total_pages: Math.ceil(total / limit),
				total_items: total,
			})
			.build();
	}

	@Patch(':id/modules/reorder')
	@ApiOperation({ summary: 'Reorder modules for a course' })
	@ApiOkResponse({ description: 'Modules reordered successfully' })
	async reorderModules(
		@Param('id') course_id: string,
		@Body() reorderDto: ReorderModulesDto,
		@User() req: JwtPayload,
	){
		if (!req.is_admin) throw new ForbiddenException('You do not have permission to reorder modules');
		await this.moduleService.reorder(course_id, reorderDto);
		return new SuccessResponseBuilder()
			.setData(reorderDto)
			.build();
	}
}