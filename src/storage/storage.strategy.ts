export interface StorageFetchResult {
  url?: string; // for presigned URLs
  stream?: NodeJS.ReadableStream; // for local files
  mime: string;
}

export interface StorageStrategy {
  /**
   * Store a file (e.g. from Multer upload)
   * Returns the stored file name or key
   */
  uploadFile(file: Express.Multer.File): Promise<string>;

  /**
   * Fetch a file for serving (either as stream or URL)
   */
  fetchFile(fileName: string): Promise<StorageFetchResult>;

  /**
   * Delete a file
   */
  deleteFile(fileName: string): Promise<void>;

  /**
   * Get a URL that can be used by clients to access the file
   * - For local: return your own domain URL (e.g. /uploads/file.png)
   * - For S3: return presigned URL or public URL
   */
  getFileUrl(fileName: string): string;
}
