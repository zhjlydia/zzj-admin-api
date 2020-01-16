import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'entity/article.entity';
import { ArticlesReq } from 'interface/article';
import { PaginationData, PaginationOptions } from 'interface/common';
import { getRepository, Repository } from 'typeorm';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async findAll(
    query: PaginationOptions,
  ): Promise<PaginationData<ArticleEntity>> {
    const { index = 1, size = 10 }: PaginationOptions = query || {};
    const qb = await getRepository(ArticleEntity).createQueryBuilder('article');
    qb.where('1 = 1');
    qb.orderBy('article.created', 'DESC');
    const total = await qb.getCount();
    qb.limit(size);
    qb.offset(index - 1);
    const list: ArticleEntity[] = await qb.getMany();
    return { index, size, list, total };
  }

  async create(articleData: ArticlesReq): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.tagList = articleData.tagList || [];

    const newArticle = await this.articleRepository.save(article);
    return newArticle;
  }
}
