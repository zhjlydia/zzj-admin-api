
import { LogModule } from '@/log/log.module';
import { StatisModule } from '@/statis/statis.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEntity } from 'core/entity/calendar.entity';
import { TaskService } from './task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CalendarEntity]),LogModule, StatisModule],
  providers: [TaskService]
})
export class TaskModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {}
}
