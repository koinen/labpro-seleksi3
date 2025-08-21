import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleRequestDto } from './dto/request/create-module-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModuleResponseDto } from './dto/response/get-modules-response.dto';
import { GetModulesResponse } from './dto/response/get-modules-response.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';
import { promises as fs } from 'fs';
import { CompleteModuleDto } from './dto/response/complete-module.dto';
import { CreateModuleResponseDto } from './dto/response/create-module-response.dto';

@Injectable()
export class ModuleService {
	constructor(
		private prisma: PrismaService,
	) {}

	async create(
		dto: CreateModuleRequestDto,
		param : {
			course_id: string,
			pdf_content: string | undefined,
			video_content: string | undefined,
		}
	): Promise<CreateModuleResponseDto> {
		const last = await this.prisma.module.findFirst({
			where: { course_id: param.course_id },
			orderBy: { order: 'desc' },
			select: {
				order: true
			}
		});

		const module = await this.prisma.module.create({
			data: {
				title: dto.title,
				description: dto.description,
				pdf_content: param.pdf_content,
				video_content: param.video_content,
				order: last ? last.order + 1 : 1,
				course_id: param.course_id,
			}
		});

		return {
			id: module.id,
			title: module.title,
			description: module.description,
			order: module.order,
			pdf_content: module.pdf_content,
			video_content: module.video_content,
			created_at: module.created_at.toString(),
			updated_at: module.updated_at.toString(),
		}
	}

	async modules(param: {
		user_id: string;
		course_id: string;
		page: number;
		limit: number;
	}, is_admin: boolean = true): Promise<GetModulesResponse> {
		const { user_id, course_id, page, limit } = param;
		const total = await this.prisma.module.count({
			where: { course_id: course_id },	
		});

		let modules;
		
		if (is_admin) {
			modules = await this.prisma.module.findMany({
				where: { course_id: course_id },
				skip: (page - 1) * limit,
				take: limit,
			});
		} else {
			modules = await this.prisma.module.findMany({
				where: { course_id: course_id, progress: { some: { user_id } } },
				skip: (page - 1) * limit,
				take: limit,
				include: {
					progress: {
						select: {
							is_completed: true
						}
					}
				}
			});
		}
		return {
			modules: modules.map(module => ({
				id: module.id,
				title: module.title,
				description: module.description,
				order: module.order,
				pdf_content: module.pdf_content,
				video_content: module.video_content,
				is_completed: is_admin ? false : module.progress[0]?.is_completed,
				created_at: module.created_at.toString(),
				updated_at: module.updated_at.toString(),
			})),
			total,
		}
	}

	async module(id: string): Promise<ModuleResponseDto> {
		const module = await this.prisma.module.findUnique({
			where: { id }, 
			include: {
				progress: {
					select: {
						is_completed: true
					}
				}
			}
		});

		if (!module) {
			throw new NotFoundException(`Module with id ${id} not found`);
		}

		return {
			id: module.id,
			title: module.title,
			description: module.description,
			order: module.order,
			pdf_content: module.pdf_content,
			video_content: module.video_content,
			is_completed: module.progress[0]?.is_completed || false,
			created_at: module.created_at.toString(),
			updated_at: module.updated_at.toString(),
		};
  	}

	async update(
		id: string, 
		dto: CreateModuleRequestDto,
		param: {
			pdf_content: string | undefined,
			video_content: string | undefined,
		}
	): Promise<CreateModuleResponseDto> {
		const { pdf_content, video_content } = param;
		const updatedModule = await this.prisma.module.update({
			where: { id },
			data: {
				title: dto.title,
				description: dto.description,
				pdf_content: pdf_content,
				video_content: video_content,
			}
		});
		return {
			id: updatedModule.id,
			title: updatedModule.title,
			description: updatedModule.description,
			order: updatedModule.order,
			pdf_content: updatedModule.pdf_content,
			video_content: updatedModule.video_content,
			created_at: updatedModule.created_at.toString(),
			updated_at: updatedModule.updated_at.toString(),
		}
	}

	async remove(id: string) {
		const module = await this.prisma.module.delete({
			where: { id },
		});

		if (module.pdf_content) {
			await fs.unlink(module.pdf_content).catch(() => {
			console.warn(`File not found: ${module.pdf_content}`);
			});
		}

		if (module.video_content) {
			await fs.unlink(module.video_content).catch(() => {
			console.warn(`File not found: ${module.video_content}`);
			});
		}
	}

	async reorder(
		course_id: string, 
		dto: ReorderModulesDto
	): Promise<ReorderModulesDto> {
		const { module_order } = dto;
		await this.prisma.$transaction(
			module_order.map(({ id, order }) =>
				this.prisma.module.update({
					where: { id },
					data: { order },
				})
			)
		);
		return dto;
	}

	async complete(
		id: string,
		user_id: string,
		is_completed: boolean = true
	): Promise<CompleteModuleDto>  {

		const userModule = await this.prisma.userModuleProgress.update({
			where: { user_id_module_id: { user_id: user_id, module_id: id } },
			data: {
				is_completed: is_completed,
			},
			include: {
				module: { select: { course_id: true } },
			}
		});

		const [courseProgress, totalModules] = await this.prisma.$transaction([
			this.prisma.userModuleProgress.count({
				where: { 
					user_id,
					module: { course_id: userModule.module.course_id },
				},
			}),
			this.prisma.module.count({
				where: { course_id: userModule.module.course_id },
			}),
		]);

		const progressPercentage = (courseProgress / totalModules) * 100;
		const certificate_url = progressPercentage === 100 ? "https://www.popai.pro/resourcesasset/wp-content/uploads/2025/02/image-403.png" : null;
		
		return {
			module_id: id,
			is_completed: is_completed,
			course_progress: {
				total_modules: totalModules,
				completed_modules: courseProgress,
				percentage: progressPercentage,
			},
			certificate_url,
		};
	}
}
