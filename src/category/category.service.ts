import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'entity/category.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) {}

  /**
   * 获取分类列表
   *
   */
  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  /**
   * 创建
   *
   */
  async create(title: string, description: string): Promise<number> {
    const category = new CategoryEntity();
    category.title = title;
    category.description = description;
    const newCategory = await this.categoryRepository.save(category);
    return newCategory.id;
  }

  /**
   * 修改
   *
   */
  async update(
    id: number,
    title: string,
    description: string
  ): Promise<number> {
    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      throw new HttpException('该标签不存在', HttpStatus.BAD_REQUEST);
    }
    category.title = title;
    category.description = description;
    await this.categoryRepository.save(category);
    return id;
  }

  /**
   * 删除
   *
   */
  async delete(id: number): Promise<DeleteResult> {
    return this.categoryRepository.delete({ id });
  }
}
