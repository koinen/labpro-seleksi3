import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Match } from './confirm-password.validator';

export class RegisterRequestDto {
    @ApiProperty({ type: String })
    @IsString()
    first_name: string;

    @ApiProperty({ type: String })
    @IsString()
    last_name: string;

    @ApiProperty({ type: String })
    @IsString()
    username: string;

    @ApiProperty({ type: String })
    @IsEmail()
    email: string;

    @ApiProperty({ type: String })
    @IsString()
    password: string;

    @ApiProperty({ type: String })
    @IsString()
    @Match('password', { message: 'Passwords do not match' })
    confirm_password: string;
}

