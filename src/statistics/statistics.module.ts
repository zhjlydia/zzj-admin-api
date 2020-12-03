import { UserModule } from '@/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from 'core/entity/article.entity';
import { CategoryEntity } from 'core/entity/category.entity';
import { TagEntity } from 'core/entity/tag.entity';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity, ArticleEntity, CategoryEntity]), UserModule],
  providers: [StatisticsService],
  controllers: [StatisticsController]
})
export class StatisticsModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes(
      {
        path: 'statistics/getArticleGroupByCategory',
        method: RequestMethod.GET
      }
    );
  }
}
