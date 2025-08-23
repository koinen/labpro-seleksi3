import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterRequestDto } from './dto/request/register-request.dto';
import { HashService } from 'src/common/hash.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterResponseDto } from './dto/response/register-response.dto';
import { LoginRequestDto } from './dto/request/login-request.dto';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import { UserSummary } from 'src/user/dto/response/get-users-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService, 
        private readonly hashService: HashService,
        private jwtService: JwtService
    ) {}

    async register(dto: RegisterRequestDto, is_admin: boolean = false): Promise<RegisterResponseDto> {
    
        const user = await this.prisma.user.create({
            data: {
                username: dto.username,
                email: dto.email,
                first_name: dto.first_name,
                last_name: dto.last_name,
                password_hash: await this.hashService.hashPassword(dto.password),
                is_admin,
            },
        });

        return {
            id: user.id,
            username: user.username,
            first_name: user.first_name,
            last_name: user.last_name,
        }
    }

    async login(dto: LoginRequestDto, admin_only: boolean = false): Promise<LoginResponseDto> {
        const user = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { email: dto.identifier },
                    { username: dto.identifier }
                ]
            },
        });

        if (!user) throw new NotFoundException('User not found');
        if (!user.is_admin && admin_only) throw new UnauthorizedException('Only admins can log in from this endpoint');

        const isValid = await this.hashService.comparePassword(dto.password, user.password_hash);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        const token = await this.jwtService.signAsync(
            { sub: user.id, is_admin: user.is_admin },
        );
        
        return {
            username: user.username,
            token,
            is_admin: user.is_admin,
        };
    }

    async getSelf(user_id: string): Promise<UserSummary> {
        const user = await this.prisma.user.findUnique({
            where: { id: user_id },
        });

        if (!user) throw new NotFoundException('User not found');
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            balance: user.balance,
        };
    }
}
