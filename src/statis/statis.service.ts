import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarEntity } from 'core/entity/calendar.entity';
import { StatisVo } from 'core/models/statis';
import { StatisEntity } from 'entity/statis.entity';
import { getManager, Repository } from 'typeorm';

@Injectable()
export class StatisService {
  constructor(
    @InjectRepository(StatisEntity)
    private readonly statisRepository: Repository<StatisEntity>,
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>
  ) {}
  async createMany(statis: StatisVo[]): Promise<boolean> {
    try {
      getManager().insert(StatisEntity, statis);
      return true;
    } catch (e) {
      return false;
    }
  }
}
