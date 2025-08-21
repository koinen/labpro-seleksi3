import { ApiProperty } from "@nestjs/swagger";
import { CourseResponseDto } from "./course-response.dto";

export class CourseSummary extends CourseResponseDto {
    @ApiProperty({ type: Number })
    total_modules: number;
}

export class GetCoursesResponse {
    @ApiProperty({ type: [CourseSummary] })
    courses: CourseSummary[];

    @ApiProperty({ type: Number })
    total: number;
}