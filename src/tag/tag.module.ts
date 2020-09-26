import { AuthMiddleware } from '@/common/middleware/auth';
import { UserModule } from '@/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'core/entity/tag.entity';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), UserModule],
  providers: [TagService],
  controllers: [TagController]
})
export class TagModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      {
        path: 'tag/all',
        method: RequestMethod.GET
      },
      {
        path: 'tag/:id',
        method: RequestMethod.GET
      },
      {
        path: 'tag',
        method: RequestMethod.POST
      },
      {
        path: 'tag/:id',
        method: RequestMethod.PUT
      },
      {
        path: 'tag/:id',
        method: RequestMethod.DELETE
      }
    );
  }
}
