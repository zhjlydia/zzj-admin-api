// tslint:disable-next-line:no-var-requires
require('ts-node/register');
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import alias from 'module-alias';
import path from 'path';
import { AppModule } from './app.module';

alias.addAliases({
  '@': __dirname,
  "core": path.join(__dirname, 'core'),
  "entity": path.join(__dirname, 'core/entity'),
  "interface": path.resolve(__dirname, 'core/interface')
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
