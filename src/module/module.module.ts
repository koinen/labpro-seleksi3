import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleApiController } from './module-api.controller';
import { ModulePageController } from './module-page.controller'
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageModule } from 'src/storage/storage.module';
@Module({
  imports: [AuthModule, StorageModule],
  controllers: [ModuleApiController, ModulePageController],
  providers: [ModuleService, PrismaService],
  exports: [ModuleService],
})
export class ModuleModule {}
