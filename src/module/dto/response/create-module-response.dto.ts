import { ApiProperty } from "@nestjs/swagger";

export class CreateModuleResponseDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    title: string;

    @ApiProperty({ type: String })
    course_id: string;

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: Number })
    order: number;

    @ApiProperty({ type: String, nullable: true })
    pdf_content: string | null;

    @ApiProperty({ type: String, nullable: true })
    video_content: string | null;

    @ApiProperty({ type: String })
    created_at: string;

    @ApiProperty({ type: String })
    updated_at: string;
}