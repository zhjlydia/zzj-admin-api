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
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get('all')
  async findAll(
    @Query('index') index: number,
    @Query('size') size: number,
    @Query('module') module?: string
  ) {
    return this.tagService.findAll(Number(index) || 0, Number(size), module);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.tagService.findOne(id);
  }

  @Post()
  async create(
    @Body('content') content: string,
    @Body('module') module: string
  ) {
    return this.tagService.create(content, module);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('content') content: string,
    @Body('module') module: string
  ) {
    return this.tagService.update(id, content, module);
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.tagService.delete(id);
  }
}
