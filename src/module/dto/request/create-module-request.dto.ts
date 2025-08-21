import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator"; 

export class CreateModuleRequestDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Introduction to Programming' })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Learn the basics of programming.' })
    description: string;
}
