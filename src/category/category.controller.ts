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
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 获取分类列表
   * @param index
   * @param size
   * @param module
   */
  @Get('all')
  async findAll(
    @Query('index') index: number,
    @Query('size') size: number,
    @Query('module') module?: string
  ) {
    return this.categoryService.findAll(
      Number(index) || 0,
      Number(size),
      module
    );
  }

  /**
   * 获取分类详情
   * @param id
   */
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  /**
   * 创建分类
   * @param title
   * @param description
   * @param module
   */
  @Post()
  async create(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('module') module: string
  ) {
    return this.categoryService.create(title, description, module);
  }

  /**
   * 编辑分类
   * @param id
   * @param title
   * @param description
   * @param module
   */
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('module') module: string
  ) {
    return this.categoryService.update(id, title, description, module);
  }

  /**
   * 删除
   * @param id
   */
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.categoryService.delete(id);
  }
}
