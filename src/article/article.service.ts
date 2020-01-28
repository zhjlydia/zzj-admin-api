import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'entity/article.entity';
import { ArticlesReq } from 'interface/article';
import { PaginationData, PaginationOptions } from 'interface/common';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  userRepository: any;
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>
  ) {}

  /**
   * 获取文章列表
   *
   */
  async findAll(
    query: PaginationOptions
  ): Promise<PaginationData<ArticleEntity>> {
    const { index = 1, size = 10 }: PaginationOptions = query || {};
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.classification', 'classification');
    qb.where('1 = 1');
    qb.andWhere('author.isAdmin = true');
    qb.orderBy('article.created', 'DESC');
    const total = await qb.getCount();
    qb.limit(size);
    qb.offset(index - 1);
    const list: ArticleEntity[] = await qb.getMany();
    return { index, size, list, total };
  }

  /**
   * 创建
   *
   */
  async create(
    userId: number,
    articleData: ArticlesReq
  ): Promise<ArticleEntity> {
    console.log(articleData);
    const article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.content = articleData.content;
    article.authorId = 1;
    article.classificationId = 1;

    const newArticle = await this.articleRepository.save(article);
    return newArticle;
  }
}
