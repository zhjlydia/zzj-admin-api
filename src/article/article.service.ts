import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { ArticleEntity } from '../core/entity/article.entity';
import { ArticlesReq } from '../core/interface/article';
import { PaginationData, PaginationOptions } from '../core/interface/common';

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
