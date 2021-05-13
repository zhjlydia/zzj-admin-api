import { LogService } from '@/log/log.service';
import { Controller, Get, Query } from '@nestjs/common';
import { SummaryDataDto } from 'core/models/dashboard';
import { formatDayOfStart } from 'core/utils/date';
import dayjs from 'dayjs';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly logService: LogService
  ) {}

  /**
   * 文章分类统计
   */
  @Get('getArticleGroupByCategory')
  async getArticleGroupByCategory() {
    return await this.dashboardService.getArticleGroupByCategory();
  }

  /**
   * 获取pv/uv按日统计
   * @param begin
   * @param end
   */
  @Get('getDailyPvUv')
  async getDailyPvUv(@Query('begin') begin: string, @Query('end') end: string) {
    let includeToday = false;
    let endDate = end;

    if (!dayjs(formatDayOfStart(end)).isBefore(dayjs(), 'day')) {
      includeToday = true;
      endDate = dayjs()
        .subtract(1, 'day')
        .format('YYYY-MM-DD');
    }
    const [pv, uv] = await Promise.all([
      this.dashboardService.getDailyStatis(
        new Date(formatDayOfStart(begin)),
        new Date(formatDayOfStart(endDate)),
        'pv'
      ),
      this.dashboardService.getDailyStatis(
        new Date(formatDayOfStart(begin)),
        new Date(formatDayOfStart(endDate)),
        'uv'
      )
    ]);

    const today = dayjs()
      .startOf('date')
      .format('YYYY-MM-DD');
    if (includeToday) {
      const todayPv = await this.logService.getPv(
        new Date(formatDayOfStart(today)),
        new Date()
      );
      const todayUv = await this.logService.getUv(
        new Date(formatDayOfStart(today)),
        new Date()
      );
      pv.push({
        name: today,
        value: String(todayPv)
      });
      uv.push({
        name: today,
        value: String(todayUv)
      });
    }

    return {
      pv,
      uv
    };
  }

  /**
   * 获取文章创建数按月统计
   * @param begin
   * @param end
   */
  @Get('getArticleCountByMonth')
  async getArticleCountByMonth(
    @Query('begin') begin: string,
    @Query('end') end: string
  ) {
    const beginDate = new Date(formatDayOfStart(begin));
    const endDate = new Date(formatDayOfStart(end));
    const data = await this.dashboardService.getArticleCountByMonth(
      beginDate,
      endDate
    );
    return data;
  }

  /**
   * 获取阅读量top 5
   */
  @Get('getTop5Article')
  async getTop5Article() {
    return this.dashboardService.getTop5Article();
  }

  /**
   * 获取摘要数据
   */
  @Get('getSummaryData')
  async getSummaryData(): Promise<SummaryDataDto> {
    const [pvuv, articleCount, projectCount] = await Promise.all([
      this.dashboardService.getTotalPvUv(),
      this.dashboardService.getArticleCount(),
      this.dashboardService.getProjectCount()
    ]);
    return { ...pvuv, articleCount, projectCount };
  }
}
