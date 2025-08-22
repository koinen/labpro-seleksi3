import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModuleService } from 'src/module/module.service';
import { FileService } from 'src/common/file.service';

@Module({
  imports: [AuthModule],
  controllers: [CourseController],
  providers: [CourseService, PrismaService, ModuleService, FileService],
})
export class CourseModule {}
