import { Controller, Get, Post, Body, Put, Param, Delete, Query, NotFoundException, ParseIntPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequestDto } from './dto/request/update-user-request.dto';
import { IncrementBalanceRequestDto } from './dto/request/increment-balance-request.dto';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { SuccessResponseBuilder } from '../common/response/response-builder';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { GetSingleUserResponse } from './dto/response/get-single-user-response.dto';
import { createSwaggerResponse, createSwaggerResponseWithPagination } from 'src/common/response/swagger-response-factory';
import { IncrementBalanceResponseDto } from './dto/response/increment-balance-response.dto';
import { UpdateUserResponseDto } from './dto/response/update-user-response.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@UseGuards(AuthGuard)
@Controller('api/users')
export class UserController {
    constructor(private readonly userService: UserService) {}
    
	@Get()
	@ApiOperation({ summary: 'Get all users with optional search and pagination' })
    @ApiOkResponse({ type: createSwaggerResponseWithPagination(GetSingleUserResponse), description: 'list of users in page P, with size X' })
    async findAll(
    	@Query() query : PaginationQueryDto,
    ) {
		const { users, total } = await this.userService.users(query);

		return new SuccessResponseBuilder()
			.setData(users)
			.setPagination({
				current_page: query.page,
				total_pages: Math.ceil(total / query.limit),
				total_items: total
			})
			.build();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get user by ID' })
    @ApiOkResponse({ type: createSwaggerResponse(GetSingleUserResponse), description: 'User details' })
    async findOne(@Param('id') id: string) {
		const userDetails = await this.userService.user(id);
		return new SuccessResponseBuilder()
			.setData(userDetails)
			.build();
    }

    @Post(':id/balance')
    @ApiOperation({ summary: 'Increment user balance' })
    @ApiOkResponse({ type: createSwaggerResponse(IncrementBalanceResponseDto), description: 'User balance incremented successfully' })
    async incrementBalance(
		@Param('id') id: string, 
		@Body() incrementBalanceDto: IncrementBalanceRequestDto,
		@User() req: JwtPayload,
	) {
		if (!req.is_admin) throw new ForbiddenException('You are not allowed to perform this action');
		const user = await this.userService.incrementBalance({ id, dto: incrementBalanceDto });
		return new SuccessResponseBuilder()
			.setData(user)
			.build();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update user by ID (disabled for admin users)' })
    @ApiOkResponse({ type: createSwaggerResponse(UpdateUserResponseDto), description: 'User updated successfully' })
    async update(
		@Param('id') id: string, 
		@Body() updateUserDto: UpdateUserRequestDto,
		@User() req: JwtPayload
	) {
		if (!req.is_admin) throw new ForbiddenException('You are not allowed to perform this action');
		const user = await this.userService.updateUser({ id, dto: updateUserDto });
		return new SuccessResponseBuilder()
			.setData(user)
			.build();
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete user by ID (disabled for admin users)' })
    @ApiOkResponse({ description: 'User deleted successfully' })
    async remove(
		@Param('id') id: string,
		@User() req: JwtPayload
	) {
		if (!req.is_admin) throw new ForbiddenException('You are not allowed to perform this action');
      	await this.userService.deleteUser(id);
  	}
}
