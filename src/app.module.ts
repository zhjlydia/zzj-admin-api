import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LogModule } from './log/log.module';
import { ProjectModule } from './project/project.module';
import { ShareModule } from './share/share.module';
import { StatisModule } from './statis/statis.module';
import { TagModule } from './tag/tag.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    ArticleModule,
    ProjectModule,
    TagModule,
    CategoryModule,
    UserModule,
    ShareModule,
    DashboardModule,
    LogModule,
    StatisModule,
    TaskModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
