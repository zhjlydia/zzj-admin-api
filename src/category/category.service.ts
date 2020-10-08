import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationData } from 'core/models/common';
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
  async findAll(
    index: number,
    size: number,
    module?: string
    ): Promise<PaginationData<CategoryEntity>> {
      let res = null;
      if (module) {
        res = await this.categoryRepository.findAndCount({where: {module}, take: size, skip: (index - 1) * size});
      } else {
        res = await this.categoryRepository.findAndCount({take: size, skip: (index - 1) * size});
      }

      return { index, size, list: res[0], total: res[1] };
  }

  /**
   * 获取分类详情
   *
   */
  async findOne(id: number): Promise<CategoryEntity> {
    const res = await this.categoryRepository.findOne({id});
    return res;
  }

  /**
   * 创建
   *
   */
  async create(title: string, description: string, module: string): Promise<number> {
    const category = new CategoryEntity();
    category.title = title;
    category.description = description;
    category.module = module;
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
    description: string,
    module: string
  ): Promise<number> {
    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      throw new HttpException('该标签不存在', HttpStatus.BAD_REQUEST);
    }
    category.title = title;
    category.description = description;
    category.module = module;
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
