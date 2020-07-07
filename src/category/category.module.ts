import { AuthMiddleware } from '@/core/middleware/auth';
import { UserModule } from '@/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../core/entity/category.entity';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity]), UserModule],
  providers: [CategoryService],
  controllers: [CategoryController]
})
export class CategoryModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'category/all',
        method: RequestMethod.GET
      },
      {
        path: 'category',
        method: RequestMethod.POST
      },
      {
        path: 'category/:id',
        method: RequestMethod.PUT
      },
      {
        path: 'category/:id',
        method: RequestMethod.DELETE
      }
    );
  }
}
