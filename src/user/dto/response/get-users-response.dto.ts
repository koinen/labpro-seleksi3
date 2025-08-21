import { ApiProperty } from "@nestjs/swagger";

export class UserSummary {
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
}

export class GetUsersResponse {
    @ApiProperty({ type: [UserSummary] })
    users: UserSummary[];

    @ApiProperty({ type: Number })
    total: number;
}