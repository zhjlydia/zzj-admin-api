import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationData } from 'core/models/common';
import { TagEntity } from 'entity/tag.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  /**
   * 获取标签列表
   *
   */
  async findAll(
    index: number,
    size: number
    ): Promise<PaginationData<TagEntity>> {
    const res = await this.tagRepository.findAndCount({take: size, skip: (index - 1) * size});
    return { index, size, list: res[0], total: res[1] };
  }

  /**
   * 获取分类详情
   *
   */
  async findOne(id: number): Promise<TagEntity> {
    const res = await this.tagRepository.findOne({id});
    return res;
  }

  /**
   * 创建
   *
   */
  async create(content: string, module: string): Promise<number> {
    const tag = new TagEntity();
    tag.content = content;
    tag.module = module;
    const newTag = await this.tagRepository.save(tag);
    return newTag.id;
  }

  /**
   * 修改
   *
   */
  async update(id: number, content: string, module: string): Promise<number> {
    const tag = await this.tagRepository.findOne({ id });
    if (!tag) {
      throw new HttpException('该标签不存在', HttpStatus.BAD_REQUEST);
    }
    tag.content = content;
    tag.module = module;
    await this.tagRepository.save(tag);
    return id;
  }

  /**
   * 删除
   *
   */
  async delete(id: number): Promise<DeleteResult> {
    return this.tagRepository.delete({ id });
  }
}
