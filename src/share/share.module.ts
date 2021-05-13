import { AuthMiddleware } from '@/common/middleware/auth';
import { OssService } from '@/common/services/oss';
import { UserModule } from '@/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common';
import { ShareController } from './share.controller';
import { ShareService } from './share.service';

@Module({
  imports: [UserModule],
  providers: [ShareService, OssService],
  controllers: [ShareController]
})
export class ShareModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: 'share/upload',
      method: RequestMethod.POST
    });
  }
}
