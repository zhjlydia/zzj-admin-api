import { LogService } from '@/log/log.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'core/entity/article.entity';
import { CalendarEntity } from 'core/entity/calendar.entity';
import { LogEntity } from 'core/entity/log.entity';
import { MonthsEntity } from 'core/entity/months.entity';
import { StatisEntity } from 'core/entity/statis.entity';
import { CommonStatisDto } from 'core/models/dashboard';
import { formatDayOfStart } from 'core/utils/date';
import dayjs from 'dayjs';
import { ProjectEntity } from 'entity/project.entity';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private logService: LogService
  ) {}

  /**
   * 获取分类下的文章数量
   */
  async getArticleGroupByCategory(): Promise<CommonStatisDto[]> {
    const articleQb: CommonStatisDto[] = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .select('category.title', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy('article.categoryId')
      .getRawMany();

    return articleQb;
  }

  /**
   * 获取文章数量
   */
  async getArticleCount(): Promise<number> {
    const count = await this.articleRepository.count();
    return count;
  }

  /**
   * 获取项目数量
   */
  async getProjectCount(): Promise<number> {
    const count = await this.projectRepository.count();
    return count;
  }

  /**
   * 获取按日统计的数据
   */
  async getDailyStatis(
    begin: Date,
    end: Date,
    type: string
  ): Promise<CommonStatisDto[]> {
    const dailyDataList: CommonStatisDto[] = await getRepository(CalendarEntity)
      .createQueryBuilder('calendar')
      .leftJoinAndSelect(StatisEntity, 'statis', 'statis.date = calendar.date')
      .select('COALESCE (statis.count, 0)', 'value')
      .addSelect("date_format(calendar.date,'%Y-%m-%d')", 'name')
      .where('statis.type =:type', { type })
      .andWhere('calendar.date >=:begin and calendar.date <=:end', {
        begin,
        end
      })
      .getRawMany();

    return dailyDataList;
  }

  /**
   * 获取总pv/uv
   */
  async getTotalPvUv() {
    const historyPv = await getRepository(StatisEntity)
      .createQueryBuilder('statis')
      .select('SUM(count)', 'count')
      .addSelect('type')
      .groupBy('type')
      .getRawMany();

    const begin = formatDayOfStart();
    const end = formatDayOfStart(
      dayjs()
        .add(1, 'day')
        .format('YYYY-MM-DD')
    );

    const [todaypv, todayuv] = await Promise.all([
      this.logService.getPv(new Date(begin), new Date(end)),
      this.logService.getUv(new Date(begin), new Date(end))
    ]);
    const pv =
      Number(historyPv.find(item => item.type === 'pv').count) + todaypv;
    const uv =
      Number(historyPv.find(item => item.type === 'uv').count) + todayuv;
    return {
      pv,
      uv
    };
  }

  /**
   * 获取文章按月统计
   */
  async getArticleCountByMonth(
    begin: Date,
    end: Date
  ): Promise<CommonStatisDto[]> {
    const articleCountList: CommonStatisDto[] = await getRepository(
      MonthsEntity
    )
      .createQueryBuilder('months')
      .leftJoinAndSelect(
        ArticleEntity,
        'article',
        "date_format(article.createdAt,'%Y-%m') = months.mon"
      )
      .select('COALESCE (count(article.id), 0)', 'value')
      .addSelect('months.mon', 'name')
      .andWhere('months.mon >=:begin and months.mon <=:end', {
        begin: dayjs(begin).format('YYYY-MM'),
        end: dayjs(end).format('YYYY-MM')
      })
      .groupBy('months.mon')
      .getRawMany();

    return articleCountList;
  }

  /**
   * 获取阅读量前5的文章
   */
  async getTop5Article(): Promise<CommonStatisDto[]> {
    const data: CommonStatisDto[] = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .innerJoin(
        subQuery => {
          return subQuery
            .select('COUNT(*)', 'count')
            .addSelect('log.targetId', 'targetId')
            .from(LogEntity, 'log')
            .where('log.module =:article', { article: 'article' })
            .groupBy('log.targetId');
        },
        'c',
        'article.id=c.targetId'
      )
      .select('article.title', 'name')
      .addSelect('count', 'value')
      .orderBy('c.count', 'DESC')
      .limit(5)
      .getRawMany();
    return data;
  }
}
