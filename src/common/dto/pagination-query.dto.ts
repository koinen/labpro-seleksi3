import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';

export class PaginationQueryDto {
    @ApiProperty({ required: false, example: '' })
    @IsString()
    @IsOptional()
    q: string = '';

    @ApiProperty({ required: false, example: 1, default: 1 })
    @Type(() => Number)
    @IsNumber()
    page: number = 1;

    @ApiProperty({ required: false, example: 15, default: 15 })
    @Type(() => Number)
    @IsNumber()
    @Transform(({ value }) => {
        const num = Number(value);
        if (num < 1) return 15;
        if (num > 50) return 50;
        return num;
    })
    limit: number = 15;
}
