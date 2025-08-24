import { Module } from '@nestjs/common';
import { PublicPageController } from './public-page.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ModuleModule } from './module/module.module';
import { CourseModule } from './course/course.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ProtectedPageController } from './protected-page.controller';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [UserModule, ModuleModule, StorageModule, CourseModule, AuthModule, CommonModule, 
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
  ],
  controllers: [PublicPageController, ProtectedPageController],
  providers: [AppService],
})
export class AppModule {}
