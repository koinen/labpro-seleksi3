import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequestDto {
    @ApiProperty({ required: false, type: String })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({ required: false, type: String })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ required: false, type: String })
    @IsString()
    @IsOptional()
    first_name?: string;

    @ApiProperty({ required: false, type: String })
    @IsString()
    @IsOptional()
    last_name?: string;

    @ApiProperty({ required: false, type: String })
    @IsString()
    @IsOptional()
    password?: string;
}
