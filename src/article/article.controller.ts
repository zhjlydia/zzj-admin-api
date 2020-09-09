import { User } from '@/common/decorators/user';
import { OssService } from '@/common/services/oss';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ArticleEntity } from 'core/entity/article.entity';
import { ArticleVo } from 'core/models/article';
import { PaginationData } from 'core/models/common';
import dayjs from 'dayjs';
import nanoid from 'nanoid/generate';
import path from 'path';
import { DeleteResult } from 'typeorm';
import { ArticleService } from './article.service';
const dict = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService, private readonly ossService: OssService) {}

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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file): Promise<string> {
    const name = nanoid(dict, 12);
    const ext = path.extname(file.originalname);
    const filename = `${dayjs().format('YYYYMMDDHHmmssms')}-${name + ext}`;
    return this.ossService.put(filename, file.buffer, 'blog/articles/');
  }
}
