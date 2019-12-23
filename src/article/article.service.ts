import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { ArticleEntity } from '../core/entity/article.entity';
import { ArticlesReq, ArticlesRes } from '../core/interface/article';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async findAll(query): Promise<ArticlesRes> {

    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article');

    qb.where('1 = 1');

    qb.orderBy('article.created', 'DESC');

    const articlesCount = await qb.getCount();

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return {articles, articlesCount};
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
