import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageModule } from 'src/storage/storage.module';
@Module({
  imports: [AuthModule, StorageModule],
  controllers: [ModuleController],
  providers: [ModuleService, PrismaService],
  exports: [ModuleService],
})
export class ModuleModule {}
