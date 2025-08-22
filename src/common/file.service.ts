// file.service.ts
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as fs from 'fs';

@Injectable()
export class FileService {
    private uploadDir = join(__dirname, '..', '..', 'uploads');

    getFilePath(filename: string): string {
        return join(this.uploadDir, filename);
    }

    deleteFile(filename: string | undefined | null): void {
        if (!filename) return;
        const path = this.getFilePath(filename);
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }

    getFileUrl(filename: string): string {
        return `${process.env.BACKEND_URL}/uploads/${filename}`;
    }
}