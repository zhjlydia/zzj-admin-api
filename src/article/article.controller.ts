import { User } from '@/core/decorators/user';
import { ArticleEntity } from '@/core/entity/article.entity';
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
import { DeleteResult } from 'typeorm';
import { CreateArticleReq, GetArticlesReq } from '../core/interface/article';
import { PaginationData } from '../core/interface/common';
import { ArticleService } from './article.service';
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('all')
  async findAll(
    @Query() query: GetArticlesReq
  ): Promise<PaginationData<ArticleEntity>> {
    return await this.articleService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ArticleEntity> {
    return await this.articleService.findOne(id);
  }

  @Post()
  async create(
    @User('id') userId: number,
    @Body('article') articleData: CreateArticleReq,
    @Body('tags') tags: number[]
  ) {
    return this.articleService.create(userId, articleData, tags);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('article') articleData: CreateArticleReq,
    @Body('tags') tags: number[]
  ): Promise<number> {
    return this.articleService.update(id, articleData, tags);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.articleService.delete(id);
  }
}
