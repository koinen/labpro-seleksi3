import { ApiProperty } from "@nestjs/swagger";

export class MyCourseDetails {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    title: string;

    @ApiProperty({ type: String })
    instructor: string;

    @ApiProperty({ type: [String] })
    topics: string[];

    @ApiProperty({ type: String, nullable: true })
    thumbnail_image: string | null;

    @ApiProperty( {type: Number} )
    progress_percentage: number;

    @ApiProperty({ type: String })
    purchased_at: string;
}

export class GetMyCoursesResponseDto {
    @ApiProperty({ type: [MyCourseDetails] })
    courses: MyCourseDetails[];

    @ApiProperty({ type: Number })
    total: number;
}