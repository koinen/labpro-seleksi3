import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseApiController } from './course-api.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageModule } from 'src/storage/storage.module';
import { ModuleModule } from 'src/module/module.module';
import { CoursePageController } from './course-page.controller';

@Module({
  imports: [AuthModule, StorageModule, ModuleModule],
  controllers: [CourseApiController, CoursePageController],
  providers: [CourseService, PrismaService],
})
export class CourseModule {}
