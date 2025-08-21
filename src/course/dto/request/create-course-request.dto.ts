import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsArray, IsNumber } from "class-validator"; 

export class CreateCourseRequestDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Introduction to Programming' })
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Learn the basics of programming.' })
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'John Doe' })
    instructor: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    @ApiProperty({ example: ['programming', 'basics'] })
    topics: string[];

    @IsNotEmpty()
    @ApiProperty({ required: false, example: 1 })
    @Type(() => Number)
    @IsNumber()
    price: number;
}
