import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IncrementBalanceRequestDto {
  @ApiProperty({ type: Number, description: 'Amount to increment the balance by' })
  @IsNumber()
  increment: number;
}