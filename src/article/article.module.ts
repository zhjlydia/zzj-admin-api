import { ClassificationEntity } from '@/core/entity/classification.entity';
import { UserEntity } from '@/core/entity/user.entity';
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
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, ClassificationEntity]),
    UserModule
  ],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes({ path: 'article', method: RequestMethod.GET });
  }
}
