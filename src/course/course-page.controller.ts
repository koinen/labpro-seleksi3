import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Query, UseGuards, Put, ForbiddenException, UploadedFiles, HttpCode, HttpStatus } from '@nestjs/common';
import { CourseService } from './course.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { createSwaggerResponse, createSwaggerResponseWithPagination } from 'src/common/response/swagger-response-factory';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { BuyCourseResponse } from './dto/response/buy-course-response.dto';
import { ModuleService } from 'src/module/module.service';
import { SuccessResponseBuilder } from 'src/common/response/response-builder';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@UseGuards(AuthGuard)
@Controller('courses')
export class CoursePageController {
    constructor(
        private readonly courseService: CourseService,
        private readonly moduleService: ModuleService,
    ) {}

    @Get()
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
    async findOne(@Param('id') id: string) {
        const course = await this.courseService.course(id);
        return new SuccessResponseBuilder()
            .setData(course)
            .build();
    }

    @Get(':id/modules')
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
    }
    
    @Post(':id/buy')
    @ApiOperation( { summary: 'Buy a course by ID' } )
    @ApiOkResponse( { type: createSwaggerResponse(BuyCourseResponse), description: 'Course purchased successfully',  } )
    async buyCourse(
        @Param('id') id: string,
        @User() req: JwtPayload
    ) {
        const purchaseDetails = await this.courseService.buyCourse(id, req.sub);
        return new SuccessResponseBuilder("Course purchased successfully")
            .setData(purchaseDetails)
            .build();
    }
}