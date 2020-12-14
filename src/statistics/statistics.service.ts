import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'core/entity/article.entity';
import { CategoryEntity } from 'entity/category.entity';
import { ProjectEntity } from 'entity/project.entity';
import { TagEntity } from 'entity/tag.entity';
import { EntityManager, getManager, getRepository, Repository } from 'typeorm';

@Injectable()
export class StatisticsService {
  private readonly manager: EntityManager;
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) {
    this.manager = getManager();
  }

   /**
    * 获取文章数量
    */
   async getArticleCount(): Promise<number> {
    const count = await this.articleRepository.count();
    return count;
  }

   /**
    * 获取项目数量
    */
   async getProjectCount(): Promise<number> {
    const count = await this.projectRepository.count();
    return count;
  }

   /**
    * 获取分类下的文章数量
    */
  async getArticleGroupByCategory(): Promise<any> {
    const articleQb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.category', 'category')
      .select('category.title', 'name')
      .addSelect('COUNT(*)', 'value')
      .groupBy('article.categoryId')
      .getRawMany();

    return articleQb;
  }

}
