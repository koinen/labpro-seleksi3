import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
    @ApiProperty({ type: String })
    @IsString()
    identifier: string; // could be email or username

    @ApiProperty({ type: String })
    @IsString()
    password: string;
}

