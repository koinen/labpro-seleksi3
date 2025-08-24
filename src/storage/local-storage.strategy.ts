import { Injectable, NotFoundException } from '@nestjs/common';
import path, { join } from 'path';
import * as fs from 'fs';
import { StorageFetchResult, StorageStrategy } from './storage.strategy';
import mime from 'mime';

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
    private uploadDir = join(__dirname, '..', '..', 'uploads');

    private getFilePath(fileName: string): string {
        const filePath = join(this.uploadDir, fileName);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        throw new NotFoundException('File not found');
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const ext = path.extname(file.originalname);
        const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const uniqueFileName = `${Date.now()}-${baseName}-${uniqueSuffix}${ext}`;  

        const filePath = join(this.uploadDir, uniqueFileName);
        await fs.promises.writeFile(filePath, file.buffer);
        return this.getFileUrl(uniqueFileName);
    }

    async deleteFile(fileName: string): Promise<void> {
        const filePath = this.getFilePath(fileName);
        if (filePath && fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    }

    async fetchFile(fileName: string): Promise<StorageFetchResult> {
        const filePath = this.getFilePath(fileName);
        return {
            stream: fs.createReadStream(filePath), 
            mime: mime.lookup(filePath) || 'application/octet-stream',
        };
    }

    getFileUrl(fileName: string): string {
        return `${process.env.BACKEND_URL}/uploads/${fileName}`;
    }
}