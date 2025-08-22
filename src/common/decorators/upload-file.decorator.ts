import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


function createMulterOptions(destination = './uploads') {
    return {
        storage: diskStorage({
            destination,
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = file.originalname.split('.').pop();
                cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
            },
        }),
        limits: {
            fileSize: 10 * 1024 * 1024, // 10 MB
        },
        fileFilter: (req, file, cb) => {
            if (['pdf', 'mp4', 'jpg', 'png'].includes(file.originalname.split('.').pop())) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type'), false);
            }
        },
    };
}

export const UploadFile = (fieldName: string, destination?: string) =>
  FileInterceptor(fieldName, createMulterOptions(destination));

export const UploadFiles = (fields: { name: string; maxCount: number }[], destination?: string) =>
  FileFieldsInterceptor(fields, createMulterOptions(destination));