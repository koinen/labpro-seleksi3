import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { ModuleController } from './module.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from 'src/common/file.service';

@Module({
  imports: [AuthModule],
  controllers: [ModuleController],
  providers: [ModuleService, PrismaService, FileService],
})
export class ModuleModule {}
