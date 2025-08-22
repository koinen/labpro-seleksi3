import { Module } from '@nestjs/common';
import { HashService } from './hash.service';
import { FileService } from './file.service';

@Module({
  providers: [HashService, FileService],
  exports: [HashService, FileService],
})
export class CommonModule {}