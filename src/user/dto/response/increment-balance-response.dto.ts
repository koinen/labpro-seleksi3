import { ApiProperty } from "@nestjs/swagger";

export class IncrementBalanceResponseDto {
    @ApiProperty({ type: String })
    id: string;

    @ApiProperty({ type: String })
    username: string;

    @ApiProperty({ type: Number })
    balance: number;
}