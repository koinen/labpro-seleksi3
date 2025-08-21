import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponseDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    username: string;

    @ApiProperty({ type: String })
    first_name: string;

    @ApiProperty({ type: String })
    last_name: string;
}