import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'core/entity/article.entity';
import { CategoryEntity } from 'entity/category.entity';
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
    private readonly articleRepository: Repository<ArticleEntity>
  ) {
    this.manager = getManager();
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
