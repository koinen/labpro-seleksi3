import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseRequestDto } from './dto/request/create-course-request.dto';
import { CourseResponseDto } from './dto/response/course-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseSummary, GetCoursesResponse } from './dto/response/get-courses-response.dto';
import { UpdateCourseRequestDto } from './dto/request/update-course-request.dto';
import { GetMyCoursesResponseDto } from './dto/response/get-my-courses-response.dto';
import { BuyCourseResponse } from './dto/response/buy-course-response.dto';
import * as fs from 'fs/promises';
import path from 'path';
import { FileService } from 'src/common/file.service';


@Injectable()
export class CourseService {
	constructor(
		private prisma: PrismaService,
		private readonly fileService: FileService, // Assuming you have a FileService for handling file operations
	) {}

	async create(
		dto: CreateCourseRequestDto, 
		file_name: string
	): Promise<CourseResponseDto> {

		const createdCourse = await this.prisma.course.create({
			data: {
				title: dto.title,
				description: dto.description,
				instructor: dto.instructor,
				price: dto.price,
				thumbnail_image: file_name,
				topics: {
					create: dto.topics.map(topic => ({ name: topic })),
				}
			},
			include: {
				topics: true, 
			},
		});

		return {
			id: createdCourse.id,
			title: createdCourse.title,
			description: createdCourse.description,
			instructor: createdCourse.instructor,
			price: createdCourse.price.toNumber(),
			thumbnail_image: `${process.env.BACKEND_URL}/uploads/${createdCourse.thumbnail_image}`,
			topics: createdCourse.topics.map(topic => topic.name),
			created_at: createdCourse.created_at.toString(),
			updated_at: createdCourse.updated_at.toString(),
		};
	}

	async courses( params: {
		search: string;
		page: number;
		limit: number;
	}): Promise<GetCoursesResponse> {
		const { search, page, limit } = params;
		const [courses, total] = await this.prisma.$transaction([
			this.prisma.course.findMany({
				where: {
					OR: [
						{ title: { contains: search } },
						{ topics: { 
							some: {
              					name: { contains: search },
            				}, 
						} },
						{ instructor: { contains: search } },
					],
				},
				skip: (page - 1) * limit,
				take: limit,
				include: {
					topics: true,
					_count: {
						select: { module: true }
					},
				},
			}),
			this.prisma.course.count({
				where: {
					OR: [
						{ title: { contains: search } },
						{ description: { contains: search } },
					],
				},
			}),
		]);
		return {
			courses: courses.map(course => ({
				id: course.id,
				title: course.title,
				description: course.description,
				instructor: course.instructor,
				price: course.price.toNumber(),
				thumbnail_image: `${process.env.BACKEND_URL}/uploads/${course.thumbnail_image}`,
				topics: course.topics.map(topic => topic.name),
				created_at: course.created_at.toString(),
				updated_at: course.updated_at.toString(),
				total_modules: course._count.module,
			})),
			total,
		}
	}

	async myCourses(
		userId: string,
		params: {
			search: string;
			page: number;
			limit: number;
		}
	): Promise<GetMyCoursesResponseDto> {
		const { search, page, limit } = params;
		const [ courses, total ] = await this.prisma.$transaction([
			this.prisma.course.findMany({
				where: {
						OR: [
							{ title: { contains: search } },
							{ topics: { some: { name: { contains: search } } } },
							{ instructor: { contains: search } },
						],
						enrollment: { some: { user_id: userId } },
					},
					skip: (page - 1) * limit,
					take: limit,
					include: {
					topics: true,
					_count: { select: { module: true } },
					enrollment: { select: { enrolled_at: true } },
				},
			}),
			this.prisma.course.count({
				where: {
				OR: [
					{ title: { contains: search } },
					{ description: { contains: search } },
				],
				},
			}),
		]);

		const courseIds = courses.map(c => c.id);

		const userModules = await this.prisma.userModuleProgress.findMany({
			where: {
				user_id: userId,
				module: { course_id: { in: courseIds } },
			},
			select: {
				module: { select: { course_id: true } },
				is_completed: true,
			},
		});

		const courseProgress = userModules.reduce((acc, curr) => {
			const courseId = curr.module.course_id;
			if (!acc[courseId]) {
				acc[courseId] = { completed: 0, total: 0 };
			}
			if (curr.is_completed) acc[courseId].completed += 1;
			acc[courseId].total += 1;
			return acc;
		}, {});

		return {
			courses: courses.map(course => ({
				id: course.id,
				title: course.title,
				description: course.description,
				instructor: course.instructor,
				price: course.price.toNumber(),
				thumbnail_image: `${process.env.BACKEND_URL}/uploads/${course.thumbnail_image}`,
				topics: course.topics.map(topic => topic.name),
				created_at: course.created_at.toString(),
				updated_at: course.updated_at.toString(),
				total_modules: course._count.module,
				purchased_at: course.enrollment[0]?.enrolled_at.toString(),
				progress_percentage: courseProgress[course.id]?.completed / courseProgress[course.id]?.total * 100 || 0,
			})),
			total,
		}
	}

	async course(
		id: string,
	): Promise<CourseSummary> {
		const course = await this.prisma.course.findUnique({
			where: { id },
			include: {
				topics: true,
				_count: {
					select: { module: true }
				},
			},
		});

		if (!course) throw new NotFoundException('Course not found');

		return {
			id: course.id,
			title: course.title,
			description: course.description,
			instructor: course.instructor,
			price: course.price.toNumber(),
			thumbnail_image: `${process.env.BACKEND_URL}/uploads/${course.thumbnail_image}`,
			topics: course.topics.map(topic => topic.name),
			created_at: course.created_at.toString(),
			updated_at: course.updated_at.toString(),
			total_modules: course._count.module,
		};
	}

	async update(
		id: string,
		dto: UpdateCourseRequestDto,
		thumbnail_image: string | undefined
	): Promise<CourseResponseDto> {
		const [ oldCourse, updatedCourse ] = await this.prisma.$transaction([
			this.prisma.course.findUnique({
				where: { id },
			}),
			this.prisma.course.update({
				where: { id },
				data: {
					title: dto.title,
					description: dto.description,
					instructor: dto.instructor,
					price: dto.price,
					thumbnail_image: thumbnail_image,
					topics: {
						create: (dto.topics ?? []).map(topic => ({ name: topic })),
					}
				},
				include: {
					topics: true, 
				},
			})
		]);

		this.fileService.deleteFile(oldCourse?.thumbnail_image);

		return {
			id: updatedCourse.id,
			title: updatedCourse.title,
			description: updatedCourse.description,
			instructor: updatedCourse.instructor,
			price: updatedCourse.price.toNumber(),
			thumbnail_image: `${process.env.BACKEND_URL}/uploads/${updatedCourse.thumbnail_image}`,
			topics: updatedCourse.topics.map(topic => topic.name),
			created_at: updatedCourse.created_at.toString(),
			updated_at: updatedCourse.updated_at.toString(),
		};
	}

	async remove(id: string): Promise<void> {
		const course = await this.prisma.course.delete({
			where: { id },
		});

		this.fileService.deleteFile(course.thumbnail_image);
	}

	async buyCourse(
		userId: string,
		courseId: string, 
	): Promise<BuyCourseResponse> {
		const course = await this.prisma.course.findUnique({
			where: { id: courseId },
		});
		if (!course) throw new NotFoundException('Course not found');

		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});
		if (!user) throw new NotFoundException('User not found');

		if (user.balance < course.price.toNumber()) {
			throw new ForbiddenException('Insufficient balance');
		}

		const [ enrollment, updatedUser ] = await this.prisma.$transaction([ 
			this.prisma.enrollment.create({
				data: {
					user: { connect: { id: userId } },
					course: { connect: { id: courseId } },
				},
			}),
			this.prisma.user.update({
				where: { id: userId },
				data: {
					balance: user.balance - course.price.toNumber(),
				},
			}),
		]);

		return {
			course_id: course.id,
			user_balance: updatedUser.balance,
			transaction_id: enrollment.id,
		};
	}
}