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
import { ArticleEntity } from 'core/entity/article.entity';
import { ArticleVo } from 'core/models/article';
import { PaginationData } from 'core/models/common';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  async findAll(
    @Query('index') index: number,
    @Query('size') size: number
  ): Promise<PaginationData<ArticleEntity>> {
    return await this.articleService.findAll(Number(index) || 0, Number(size));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ArticleEntity> {
    return await this.articleService.findOne(id);
  }

  @Post()
  async create(@User('id') userId: number, @Body() article: ArticleVo) {
    return this.articleService.create(userId, article);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() article: ArticleVo
  ): Promise<number> {
    return this.articleService.update(id, article);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.articleService.delete(id);
  }
}
