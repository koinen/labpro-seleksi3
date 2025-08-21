import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty({ type: String })
    username: string;

    @ApiProperty({ type: String })
    token: string;

    @ApiProperty({ type: Boolean })
    is_admin: boolean;
}