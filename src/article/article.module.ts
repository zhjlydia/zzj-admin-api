import { AuthMiddleware } from '@/common/middleware/auth';
import { OssService } from '@/common/services/oss';
import { UserModule } from '@/user/user.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from 'core/entity/article.entity';
import { CategoryEntity } from 'core/entity/category.entity';
import { TagEntity } from 'core/entity/tag.entity';
import { UserEntity } from 'core/entity/user.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, CategoryEntity, TagEntity]),
    UserModule
  ],
  providers: [ArticleService, OssService],
  controllers: [ArticleController]
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: 'article/all',
        method: RequestMethod.GET
      }, {
        path: 'article',
        method: RequestMethod.POST
      }, {
        path: 'article/:id',
        method: RequestMethod.GET
      }, {
        path: 'article/:id',
        method: RequestMethod.PUT
      }, {
        path: 'article/:id',
        method: RequestMethod.DELETE
      });
  }
}
