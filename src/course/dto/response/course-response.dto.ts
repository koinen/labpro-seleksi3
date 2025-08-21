import { ApiProperty } from "@nestjs/swagger";

export class CourseResponseDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    title: string;

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: String })
    instructor: string;

    @ApiProperty({ type: [String] })
    topics: string[];

    @ApiProperty({ type: Number })
    price: number;

    @ApiProperty({ type: String, nullable: true })
    thumbnail_image: string | null;

    @ApiProperty({ type: String })
    created_at: string;

    @ApiProperty({ type: String })
    updated_at: string;
}