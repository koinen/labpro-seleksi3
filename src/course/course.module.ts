import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { ModuleService } from 'src/module/module.service';

@Module({
  imports: [AuthModule],
  controllers: [CourseController],
  providers: [CourseService, PrismaService, ModuleService],
})
export class CourseModule {}
