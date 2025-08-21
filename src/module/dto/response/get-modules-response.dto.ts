import { ApiProperty } from "@nestjs/swagger";
import { CreateModuleResponseDto } from "./create-module-response.dto";

export class ModuleResponseDto extends CreateModuleResponseDto {
    @ApiProperty( {type: Boolean })
    is_completed: boolean;
}

export class GetModulesResponse {
    @ApiProperty({ type: [ModuleResponseDto] })
    modules: ModuleResponseDto[];

    @ApiProperty({ type: Number })
    total: number;
}