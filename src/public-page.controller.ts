import { Controller, Get, Res, Param, Render } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class PublicPageController {
	constructor(private readonly appService: AppService) {}
	
	@Get()
	@Render('index')
	async serveHomePage() {
		return { title: 'Home' };
	}
}