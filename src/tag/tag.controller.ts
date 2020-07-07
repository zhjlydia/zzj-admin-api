import { TagEntity } from '@/core/entity/tag.entity';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  async findAll(): Promise<TagEntity[]> {
    return await this.tagService.findAll();
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
