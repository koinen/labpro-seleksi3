import { Body, Controller, Get, Post, Redirect, Render, Res, UnauthorizedException, UseFilters, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { UnauthorizedFilter } from "src/common/filters/unauthorized-exception.filter";

@Controller()
export class AuthPageController {
    constructor(private authService: AuthService) {}

    @Get('')
    @UseGuards(AuthGuard)
    @UseFilters(UnauthorizedFilter)
    @Redirect('/courses')
    redirectToCourses() {}

    @Get('login')
    @Render('login')
    showLogin() {}

    @Get('register')
    @Render('register')
    showRegister() {}
}