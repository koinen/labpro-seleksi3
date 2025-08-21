import { ApiProperty } from "@nestjs/swagger";

class CourseProgressDto {
    @ApiProperty({ type: Number })
    total_modules: number;

    @ApiProperty({ type: Number })
    completed_modules: number;

    @ApiProperty({ type: Number })
    percentage: number;
}

export class CompleteModuleDto {
    @ApiProperty({ type: String })
    module_id: string;

    @ApiProperty({ type: Boolean })
    is_completed: boolean;

    @ApiProperty({ type: CourseProgressDto })
    course_progress: CourseProgressDto;

    @ApiProperty({ type: String, nullable: true })
    certificate_url: string | null;
}