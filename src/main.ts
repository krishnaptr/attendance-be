import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
const fs = require('fs');
import helmet from 'helmet';

const pkg = require('./../package.json');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets(join(__dirname, '..', process.env.STATIC_ASSET));
  app.enableCors();
  if (process.env.SHOW_SWAGGER_API === 'true') {
    const options = new DocumentBuilder()
      .setTitle('Attendance NFC')
      .setDescription('API for Attendance NFC')
      .setVersion(pkg.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    fs.writeFileSync('./swagger-spec.json', JSON.stringify(document));
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.APP_PORT);
  console.log('APP listen to port ' + process.env.APP_PORT);
}

bootstrap();
