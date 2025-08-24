import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { UnauthorizedApiFilter } from './common/filters/unauthorized-api-exception.filter';
import { CatchAllFilter } from './common/filters/catch-all-exception.filter';
import { engine } from 'express-handlebars';

async function bootstrap() {
   const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.enableCors({
    origin: 'https://labpro-ohl-2025-fe.hmif.dev',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      defaultLayout: 'main',
    }),
  );
  app.setViewEngine('hbs');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
    }),
  );

  app.useGlobalFilters(new UnauthorizedApiFilter(), new CatchAllFilter());

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Grocademy')
    .setDescription('The Grocademy API description')
    .setVersion('1.0')
    .addTag('grocademy')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
