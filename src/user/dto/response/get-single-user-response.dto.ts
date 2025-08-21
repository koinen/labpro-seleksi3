import { ApiProperty } from "@nestjs/swagger";

export class GetSingleUserResponse {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    username: string;

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    first_name: string;

    @ApiProperty({ type: String })
    last_name: string;

    @ApiProperty({ type: Number })
    balance: number;

    @ApiProperty({ type: Number })
    courses_purchased: number;
}