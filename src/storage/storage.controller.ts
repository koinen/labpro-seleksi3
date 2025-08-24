import { Controller, Get, NotFoundException, Param, Res } from "@nestjs/common";
import express from "express";
import { StorageService } from "./storage.service";

@Controller('api/modules')
export class StorageController {
    constructor( private storageService: StorageService ) {}

    @Get('uploads/:file')
    async serveFile(
        @Param('file') fileName: string,
        @Res() res: express.Response
    ) {
        const { url, stream, mime } = await this.storageService.fetchFile(fileName);
        res.setHeader('Content-Type', mime);

        if (url) return res.redirect(url);
        if (stream) return stream.pipe(res);

        throw new NotFoundException('No file source found');
    }
}