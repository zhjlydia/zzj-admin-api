import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { CategoryModule } from './category/category.module';
import { ProjectModule } from './project/project.module';
import { ShareModule } from './share/share.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    ArticleModule,
    ProjectModule,
    TagModule,
    CategoryModule,
    UserModule,
    ShareModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
