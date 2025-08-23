import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from '../common/hash.service';
import { UpdateUserRequestDto } from './dto/request/update-user-request.dto';
import { IncrementBalanceRequestDto } from './dto/request/increment-balance-request.dto';
import { GetSingleUserResponse } from './dto/response/get-single-user-response.dto';
import { GetUsersResponse } from './dto/response/get-users-response.dto';
import { IncrementBalanceResponseDto } from './dto/response/increment-balance-response.dto';
import { UpdateUserResponseDto } from './dto/response/update-user-response.dto';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService, 
		private readonly hashService: HashService
	) {}

	async user(
    	id: string,
  	): Promise<GetSingleUserResponse> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				_count: {
					select: { enrollment : true },
				},
			},
		});

    	if (!user) throw new NotFoundException('User not found');

		return {
			id: user.id,
			username: user.username,
			email: user.email,
			first_name: user.first_name,
			last_name: user.last_name,
			balance: user.balance,
			courses_purchased: user._count.enrollment,
		};
  	}

  	async users(params: {
    	q: string;
		page: number;
		limit: number;
  	}): Promise<GetUsersResponse> {
		const { q, page, limit } = params;
		const [users, total] = await this.prisma.$transaction([
			this.prisma.user.findMany({
				where: {
					OR: [
						{ username: { contains: q } },
						{ email: { contains: q } },
						{ first_name: { contains: q } },
						{ last_name: { contains: q } },
					],
				},
				select: {
					id: true,
					username: true,
					email: true,
					first_name: true,
					last_name: true,
					balance: true,
				},
				skip: (page - 1) * limit,
				take: limit,
			}),
			this.prisma.user.count({
				where: {
					OR: [
						{ username: { contains: q } },
						{ email: { contains: q } },
						{ first_name: { contains: q } },
						{ last_name: { contains: q } },
					],
				},
			}),
		]);
		return {
			users,
			total,
		}
  	}

	async incrementBalance(params: { 
		id: string; 
		dto: IncrementBalanceRequestDto; 
	}): Promise<IncrementBalanceResponseDto> {
		const { id, dto } = params;

		const user = await this.prisma.user.findUnique({
		where: { id },
		});

		if (!user) throw new NotFoundException('User not found');

		const updatedUser = await this.prisma.user.update({
			where: { id },
			data: {
				balance: {
					increment: dto.increment,
				},
			},
		});

		return {
			id: updatedUser.id,
			username: updatedUser.username,
			balance: updatedUser.balance,
		};

	}

	async updateUser(params: {
		id: string;
		dto: UpdateUserRequestDto;
	}): Promise<UpdateUserResponseDto> {
		const { id, dto } = params;
		
		const user = await this.prisma.user.findUnique({
		where: { id },
		});

		if (!user) throw new NotFoundException('User not found');
		if (user.is_admin) throw new BadRequestException('Admin users cannot be updated');

		const updatedUser = await this.prisma.user.update({
			data: {
				username: dto.username,
				email: dto.email,
				first_name: dto.first_name,
				last_name: dto.last_name,
				password_hash: dto.password ? await this.hashService.hashPassword(dto.password) : undefined,
			},
			where: { id },
		});

		return {
			id: updatedUser.id,
			username: updatedUser.username,
			first_name: updatedUser.first_name,
			last_name: updatedUser.last_name,
			balance: updatedUser.balance,
		};
	}

	async deleteUser(
		id: string
	): Promise<void> {
		const user = await this.prisma.user.findUnique({
			where: { id },
		});

		if (!user) throw new NotFoundException('User not found');
		if (user.is_admin) throw new BadRequestException('Admin users cannot be deleted');

		await this.prisma.user.delete({
			where: { id },
		});
	}
}