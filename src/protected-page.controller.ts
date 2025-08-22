import { Controller, Get, Param, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth/auth.guard";
import type { JwtPayload } from "./common/interfaces/jwt-payload.interface";
import { User } from "./common/decorators/user.decorator";
import { AppService } from "./app.service";


@UseGuards(AuthGuard)
@Controller()
export class ProtectedPageController {
    constructor(private appService: AppService) {}

    @Get('courses')
    async browseCourses() {

    }

    @Get('my-courses')
    async myCourses(
        @User() user: JwtPayload
    ) {

    }

    @Get('course/:id')
    async course(@Param('id') id: string) {

    }

    @Get('do-course/:id')
    async doCourse(
        @Param('id') id: string,
        @User() user: JwtPayload
    ) {
        
    }

}