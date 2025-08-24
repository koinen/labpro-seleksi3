import { Catch, HttpException, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { ErrorResponseBuilder } from "../response/response-builder";
import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response, Request } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedApiFilter implements ExceptionFilter {
    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse<Response>();
        const req = ctx.getRequest<Request>();

        let status = HttpStatus.UNAUTHORIZED;
        let message = 'Unauthorized - Please login first.';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse();
            message = (res as any).message || exception.message;
        }
        console.log("BAA");
        const errorResponse = new ErrorResponseBuilder(message).build();
        return res.status(status).json(errorResponse);
    }
}