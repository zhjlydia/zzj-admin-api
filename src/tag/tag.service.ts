import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

  /**
   * 创建
   *
   */
  async create(content: string): Promise<number> {
    const tag = new TagEntity();
    tag.content = content;
    const newTag = await this.tagRepository.save(tag);
    return newTag.id;
  }

  /**
   * 修改
   *
   */
  async update(id: number, content: string): Promise<number> {
    const tag = await this.tagRepository.findOne({ id });
    if (!tag) {
      throw new HttpException('该标签不存在', HttpStatus.BAD_REQUEST);
    }
    tag.content = content;
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