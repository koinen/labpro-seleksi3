// export abstract class StorageFetcher {
//     abstract getFileUrl(fileName: string): string;
//     abstract deleteFile(fileName: string): Promise<void>;
//     abstract uploadFile(file: Express.Multer.File): Promise<string>;
//     abstract fetchFile(fileName: string): Promise<Express.Multer.File>;
// }

import { Injectable } from "@nestjs/common";
import type { StorageFetchResult, StorageStrategy } from "./storage.strategy";

@Injectable()
export class StorageService {
    constructor(private strategy: StorageStrategy) {}

    async fetchFile(fileName: string): Promise<StorageFetchResult> {
        return this.strategy.fetchFile(fileName);
    }

    async deleteFile(fileName: string): Promise<void> {
        return this.strategy.deleteFile(fileName);
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        return this.strategy.uploadFile(file);
    }

    getFileUrl(fileName: string | null): string | null {
        if (!fileName) return null;
        return this.strategy.getFileUrl(fileName);
    }
}