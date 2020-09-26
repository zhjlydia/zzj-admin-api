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
import { TagEntity } from 'core/entity/tag.entity';
import { PaginationData } from 'core/models/common';
import { DeleteResult } from 'typeorm';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  async findAll(
    @Query('index') index: number,
    @Query('size') size: number
  ): Promise<PaginationData<TagEntity>> {
    return await this.tagService.findAll(Number(index) || 0, Number(size));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<TagEntity> {
    return await this.tagService.findOne(id);
  }

  @Post()
  async create(@Body('content') content: string): Promise<number> {
    return this.tagService.create(content);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('content') content: string
  ): Promise<number> {
    return this.tagService.update(id, content);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.tagService.delete(id);
  }
}
