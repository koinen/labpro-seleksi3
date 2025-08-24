import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

function createMulterOptions(destination = './uploads', validExtensions: string[]) {
    return {
        storage: memoryStorage(),
        limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB
        },
        fileFilter: (req, file, cb) => {
            if (validExtensions.includes(file.originalname.split('.').pop())) {
                cb(null, true);
            } else {
                cb(new BadRequestException('Invalid file type'), false);
            }
        },
    };
}
export const UploadImageFile = (fieldName: string, destination?: string) =>
  FileInterceptor(fieldName, createMulterOptions(destination, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'svg']));

export const UploadContentFiles = (fields: { name: string; maxCount: number }[], destination?: string) =>
  FileFieldsInterceptor(fields, createMulterOptions(destination, ['pdf', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']));