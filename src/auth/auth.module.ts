import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashService } from 'src/common/hash.service';
import { AuthGuard } from './auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],  // so ConfigService is available
      inject: [ConfigService],  // inject it
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    CommonModule,
  ],
  providers: [AuthService, AuthGuard, PrismaService],
  controllers: [AuthController],
  exports: [AuthGuard, JwtModule, CommonModule],  // export both if other modules need them
})
export class AuthModule {}
