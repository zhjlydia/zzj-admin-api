import { ArticleModule } from '@/article/article.module';
import { AuthMiddleware } from '@/common/middleware/auth';
import { LogModule } from '@/log/log.module';
import { ProjectModule } from '@/project/project.module';
import { StatisModule } from '@/statis/statis.module';
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
import { ProjectEntity } from 'core/entity/project.entity';
import { TagEntity } from 'core/entity/tag.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagEntity,
      ArticleEntity,
      CategoryEntity,
      ProjectEntity
    ]),
    UserModule,
    ArticleModule,
    ProjectModule,
    StatisModule,
    LogModule
  ],
  providers: [DashboardService],
  controllers: [DashboardController]
})
export class DashboardModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'dashboard/getArticleGroupByCategory',
        method: RequestMethod.GET
      },
      {
        path: 'dashboard/getDailyPvUv',
        method: RequestMethod.GET
      },
      {
        path: 'dashboard/getArticleCountByMonth',
        method: RequestMethod.GET
      },
      {
        path: 'dashboard/getTop5Article',
        method: RequestMethod.GET
      },
      {
        path: 'dashboard/getSummaryData',
        method: RequestMethod.GET
      }
    );
  }
}
