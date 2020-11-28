import { NestFactory } from '@nestjs/core';
import { CommonExceptionFilter } from 'core/filters/common-exception.filter';
import { TransformInterceptor } from 'core/interceptor/transform.interceptor';
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
  // 全局错误过滤器
  app.useGlobalFilters(new CommonExceptionFilter());
  // 全局接口返回结果处理器
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}
bootstrap();
