import { Module } from '@nestjs/common';
import { AppController } from './public-page.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ModuleModule } from './module/module.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UserModule, ModuleModule, CourseModule, AuthModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
