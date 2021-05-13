import { LogService } from '@/log/log.service';
import { StatisService } from '@/statis/statis.service';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarEntity } from 'core/entity/calendar.entity';
import { formatDayOfStart } from 'core/utils/date';
import dayjs from 'dayjs';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private logService: LogService,
    private statisService: StatisService,
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>
  ) {}

  @Cron('0 0 1 * * *')
  async pvAnduvByDay(): Promise<boolean> {
    const begin = formatDayOfStart(
      dayjs()
        .subtract(1, 'day')
        .format('YYYY-MM-DD')
    );
    const end = formatDayOfStart();
    const [pv, uv] = await Promise.all([
      this.logService.getPv(new Date(begin), new Date(end)),
      this.logService.getUv(new Date(begin), new Date(end))
    ]);
    const statis = [
      {
        type: 'pv',
        count: pv,
        date: new Date(begin)
      },
      {
        type: 'uv',
        count: uv,
        date: new Date(begin)
      }
    ];

    try {
      const res = await this.statisService.createMany(statis);
      return res;
    } catch (e) {
      return false;
    }
  }
}
