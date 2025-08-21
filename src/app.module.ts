import { Module } from '@nestjs/common';
import { PublicPageController } from './public-page.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ModuleModule } from './module/module.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ProtectedPagesController } from './protected-page.controller';

@Module({
  imports: [UserModule, ModuleModule, CourseModule, AuthModule, CommonModule],
  controllers: [PublicPageController, ProtectedPagesController],
  providers: [AppService],
})
export class AppModule {}
