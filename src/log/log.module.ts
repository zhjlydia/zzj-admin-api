import { UserModule } from '@/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogEntity } from 'core/entity/log.entity';
import { LogController } from './log.controller';
import { LogService } from './log.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogEntity]), UserModule],
  providers: [LogService],
  controllers: [LogController],
  exports: [LogService]
})
export class LogModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}
