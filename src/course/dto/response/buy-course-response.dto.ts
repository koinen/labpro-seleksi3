import { ApiProperty } from "@nestjs/swagger";

export class BuyCourseResponse {
    @ApiProperty({ type: String })
    course_id: string;

    @ApiProperty({ type: Number })
    user_balance: number;

    @ApiProperty({ type: String })
    transaction_id: string;
}