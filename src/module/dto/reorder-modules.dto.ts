import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator"; 

export class NewModuleOrder {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 1 })
    order: number;
}

export class ReorderModulesDto {
    @IsNotEmpty()
    @ApiProperty({ type: [NewModuleOrder] })
    module_order: NewModuleOrder[];
}
