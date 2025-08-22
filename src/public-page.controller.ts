import { Controller, Get, Res, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from "path";
import express from "express";

@Controller()
export class PublicPageController {
	constructor(private readonly appService: AppService) {}
	
	@Get()
	@Render('index')
	async serveHomePage() {
		return { title: 'Home' };
	}

	@Get('uploads/:file')
    async serveFile(
        @Param('file') file: string,
        @Res() res: express.Response
    ) {
        const filePath = join(__dirname, '..', '..', 'uploads', file);
        res.sendFile(filePath); 
    }
}