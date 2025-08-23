import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { createSwaggerResponse } from 'src/common/response/swagger-response-factory';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { SuccessResponseBuilder } from 'src/common/response/response-builder';
import { UserSummary } from 'src/user/dto/response/get-users-response.dto';
import type { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Login user for Admin' })
    @ApiOkResponse({ type: createSwaggerResponse(LoginResponseDto), description: 'Admin logged in successfully' })
    async login(
        @Body() loginDto: LoginRequestDto,
        @User() req: JwtPayload,
    ) {
        const user = await this.authService.login(loginDto, req.is_admin);
        return new SuccessResponseBuilder()
            .setData(user)
            .build();
    }

    @Post('user-login')
    @ApiOperation({ summary: 'Login for user' })
    @ApiOkResponse({ type: createSwaggerResponse(LoginResponseDto), description: 'User logged in successfully' })
    async userLogin(@Body() loginDto: LoginRequestDto) {
        const user = await this.authService.login(loginDto);
        return new SuccessResponseBuilder()
            .setData(user)
            .build();
    }

    @UseGuards(AuthGuard)
    @Get('self')
    @ApiOperation( { summary: 'Get self profile' } )
    @ApiOkResponse( { type: createSwaggerResponse(UserSummary), description: 'User profile retrieved successfully' } )
    async getSelf(@User() user: any) {
        const self = await this.authService.getSelf(user.sub);
        return new SuccessResponseBuilder()
            .setData(self)
            .build();
    }

    @Post('register')
    @ApiOkResponse({ type: createSwaggerResponse(LoginResponseDto), description: 'Admin registered successfully' })
    @ApiOperation({ summary: 'Register a new admin' })
    async register(@Body() registerDto: RegisterRequestDto) {
        const admin = this.authService.register(registerDto, true);
        return new SuccessResponseBuilder()
            .setData(admin)
            .build();
    }

    @Post('user-register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiOkResponse({ type: createSwaggerResponse(LoginResponseDto), description: 'User registered successfully' })
    async userRegister(@Body() registerDto: RegisterRequestDto) {
        const user = this.authService.register(registerDto);
        return new SuccessResponseBuilder()
            .setData(user)
            .build();
    }
}