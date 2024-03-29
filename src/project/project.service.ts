import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'core/entity/category.entity';
import { TagEntity } from 'core/entity/tag.entity';
import { UserEntity } from 'core/entity/user.entity';
import { PaginationData } from 'core/models/common';
import { ProjectVo } from 'core/models/project';
import { ProjectEntity } from 'entity/project.entity';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  /**
   * 获取项目列表
   *
   */
  async findAll(
    index: number,
    size: number
  ): Promise<PaginationData<ProjectEntity>> {
    const qb = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.author', 'author')
      .leftJoinAndSelect('project.category', 'category')
      .leftJoinAndSelect('project.tags', 'tag')
      .select([
        'project.id',
        'project.name',
        'project.image',
        'project.description',
        'project.content',
        'project.github',
        'project.role',
        'project.url',
        'project.state',
        'project.startedAt',
        'project.endedAt',
        'project.createdAt',
        'project.updatedAt',
        'author.id',
        'author.username',
        'author.image',
        'category.id',
        'category.title',
        'tag.id',
        'tag.content'
      ]);
    qb.where('project.isDeleted = 0');

    qb.orderBy('project.createdAt', 'DESC');
    const total = await qb.getCount();
    qb.take(size);
    qb.skip((index - 1) * size);
    const list: ProjectEntity[] = await qb.getMany();
    return { index, size, list, total };
  }

  /**
   * 获取项目详情
   *
   */
  async findOne(id: number): Promise<ProjectEntity> {
    const qb = await getRepository(ProjectEntity)
      .createQueryBuilder('project')
      .innerJoinAndSelect('project.author', 'author')
      .leftJoinAndSelect('project.category', 'category')
      .leftJoinAndSelect('project.tags', 'tag')
      .select([
        'project.id',
        'project.name',
        'project.image',
        'project.description',
        'project.content',
        'project.github',
        'project.role',
        'project.url',
        'project.stateText',
        'project.state',
        'project.startedAt',
        'project.endedAt',
        'project.createdAt',
        'project.updatedAt',
        'author.username',
        'author.image',
        'category.id',
        'category.title',
        'tag.id',
        'tag.content'
      ]);
    qb.where({ id });

    const project: ProjectEntity = await qb.getOne();
    return project;
  }

  /**
   * 创建
   *
   */
  async create(userId: number, projectData: ProjectVo): Promise<number> {
    const project = new ProjectEntity();
    project.name = projectData.name;
    project.image = projectData.image;
    project.description = projectData.description;
    project.content = projectData.content;
    project.stateText = projectData.stateText;
    project.github = projectData.github;
    project.role = projectData.role;
    project.url = projectData.url;
    project.startedAt = projectData.startedAt;
    project.endedAt = projectData.endedAt;

    const author = await this.userRepository.findOne({ id: userId });
    if (!author) {
      throw new HttpException('该author不存在', HttpStatus.BAD_REQUEST);
    }
    project.author = author;

    const category = await this.categoryRepository.findOne({
      id: projectData.categoryId
    });
    if (category) {
      project.category = category;
    }
    if (projectData.tagIds && projectData.tagIds.length) {
      const existTags = await this.tagRepository.findByIds(projectData.tagIds);
      project.tags = existTags;
    } else {
      project.tags = [];
    }
    const newProject = await this.projectRepository.save(project);
    return newProject.id;
  }

  /**
   * 编辑
   *
   */
  async update(id: number, projectData: Partial<ProjectVo>): Promise<void> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) {
      throw new HttpException('该项目不存在', HttpStatus.BAD_REQUEST);
    }
    if (projectData.categoryId) {
      const category = await this.categoryRepository.findOne({
        id: projectData.categoryId
      });
      if (category) {
        project.category = category;
      }
    }
    if (projectData.tagIds) {
      const existTags = await this.tagRepository.findByIds(projectData.tagIds);
      project.tags = existTags;
    }
    await this.projectRepository.save(Object.assign(project, projectData));
  }
  /**
   * 删除
   *
   */
  async delete(id: number): Promise<void> {
    const project = await this.projectRepository.findOne({ id });
    if (!project) {
      throw new HttpException('该项目不存在', HttpStatus.BAD_REQUEST);
    }
    project.isDeleted = true;
    await this.projectRepository.save(project);
  }
}
