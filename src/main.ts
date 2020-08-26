import { NestFactory } from '@nestjs/core';
import alias from 'module-alias';
import path from 'path';
import { AppModule } from './app.module';

alias.addAliases({
  '@': __dirname,
  'core': path.join(__dirname, '../core/src'),
  'entity': path.join(__dirname, '../core/src/entity'),
  'model': path.resolve(__dirname, '../core/src/model')
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
