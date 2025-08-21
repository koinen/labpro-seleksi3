import { NotFoundException } from '@nestjs/common';

export class PageNotFoundException extends NotFoundException {
    constructor(page: string) {
        super(`Page "${page}" not found`);
    }
}