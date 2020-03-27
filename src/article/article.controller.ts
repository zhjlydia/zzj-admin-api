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

  @Get()
  async findAll(
    @Query() query: GetArticlesReq
  ): Promise<PaginationData<ArticleEntity>> {
    return await this.articleService.findAll(query);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ArticleEntity> {
    return await this.articleService.findOne(slug);
  }

  @Post()
  async create(
    @User('id') userId: number,
    @Body('article') articleData: CreateArticleReq
  ) {
    return this.articleService.create(userId, articleData);
  }

  @Put()
  async update(
    @Param('slug') slug: string,
    @Body('article') articleData: CreateArticleReq
  ): Promise<ArticleEntity> {
    return this.articleService.update(slug, articleData);
  }

  @Delete()
  async delete(@Param('slug') slug: string): Promise<DeleteResult> {
    return this.articleService.delete(slug);
  }
}
