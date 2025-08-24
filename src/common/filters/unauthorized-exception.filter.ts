import { Catch, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { ErrorResponseBuilder } from "../response/response-builder";
import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response, Request } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();

        return res.redirect('/login');
    }
}