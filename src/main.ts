import { NestFactory } from '@nestjs/core';
import alias from 'module-alias';
import path from 'path';
import { AppModule } from './app.module';

alias.addAliases({
  '@': __dirname,
  'core': path.join(__dirname, 'core'),
  'entity': path.join(__dirname, 'core/entity'),
  'model': path.resolve(__dirname, 'core/model')
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
