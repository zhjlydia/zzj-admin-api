import { User } from '@/common/decorators/user';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ArticleVo } from 'core/models/article';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  /**
   * 分页获取文章列表
   * @param index
   * @param size
   */
  @Get('all')
  async findAll(@Query('index') index: number, @Query('size') size: number) {
    return this.articleService.findAll(Number(index) || 0, Number(size));
  }

  /**
   * 获取文章详情
   * @param id
   */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.articleService.findOne(id);
  }

  /**
   * 创建文章
   * @param userId
   * @param article
   */
  @Post()
  async create(@User('id') userId: number, @Body() article: ArticleVo) {
    return this.articleService.create(userId, article);
  }

  /**
   * 编辑文章
   * @param id
   * @param article
   */
  @Put(':id')
  async update(@Param('id') id: number, @Body() article: ArticleVo) {
    return this.articleService.update(id, article);
  }

  /**
   * 删除文章
   * @param id
   */
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.articleService.delete(id);
  }
}
