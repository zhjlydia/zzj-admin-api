import { UserModule } from '@/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from '../core/entity/article.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [TypeOrmModule.forFeature([ArticleEntity]), UserModule],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes({ path: 'article', method: RequestMethod.GET });
  }
}
