import { UserModule } from '@/user/user.module';
import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEntity } from 'core/entity/calendar.entity';
import { StatisEntity } from 'core/entity/statis.entity';
import { StatisController } from './statis.controller';
import { StatisService } from './statis.service';

@Module({
  imports: [TypeOrmModule.forFeature([StatisEntity,CalendarEntity]), UserModule],
  providers: [StatisService],
  controllers: [StatisController],
  exports: [StatisService]
})
export class StatisModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
  }
}
