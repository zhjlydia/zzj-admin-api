import { ArticleEntity } from '@/core/entity/article.entity';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ArticlesReq } from '../core/interface/article';
import { PaginationData } from '../core/interface/common';
import { ArticleService } from './article.service';

@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiResponse({ status: 200, description: 'Return all articles.' })
  @Get()
  async findAll(@Query() query): Promise<PaginationData<ArticleEntity>> {
    return await this.articleService.findAll(query);
  }

  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.'
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async create(
    // @User('id') userId: number,
    @Body('article') articleData: ArticlesReq
  ) {
    return this.articleService.create(1, articleData);
  }
}
