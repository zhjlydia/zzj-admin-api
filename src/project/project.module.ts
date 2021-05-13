import { AuthMiddleware } from '@/common/middleware/auth';
import { OssService } from '@/common/services/oss';
import { UserModule } from '@/user/user.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'core/entity/category.entity';
import { ProjectEntity } from 'core/entity/project.entity';
import { TagEntity } from 'core/entity/tag.entity';
import { UserEntity } from 'core/entity/user.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectEntity, UserEntity, CategoryEntity, TagEntity]),
    UserModule
  ],
  providers: [ProjectService, OssService],
  controllers: [ProjectController],
  exports: [ProjectService]
})
export class ProjectModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({
        path: 'project/all',
        method: RequestMethod.GET
      }, {
        path: 'project',
        method: RequestMethod.POST
      }, {
        path: 'project/:id',
        method: RequestMethod.GET
      }, {
        path: 'project/:id',
        method: RequestMethod.PUT
      }, {
        path: 'project/:id',
        method: RequestMethod.DELETE
      });
  }
}
