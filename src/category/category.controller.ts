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
import { CategoryEntity } from 'core/entity/category.entity';
import { PaginationData } from 'core/models/common';
import { DeleteResult } from 'typeorm';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('all')
  async findAll(
    @Query('index') index: number,
    @Query('size') size: number
    ): Promise<PaginationData<CategoryEntity>> {
    return await this.categoryService.findAll(Number(index) || 0, Number(size));
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<CategoryEntity> {
    return await this.categoryService.findOne(id);
  }

  @Post()
  async create(
    @Body('title') title: string,
    @Body('description') description: string
  ): Promise<number> {
    return this.categoryService.create(title, description);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('description') description: string
  ): Promise<number> {
    return this.categoryService.update(id, title, description);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.categoryService.delete(id);
  }
}
