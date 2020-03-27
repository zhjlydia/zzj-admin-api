import { ClassificationEntity } from '@/core/entity/classification.entity';
import { UserEntity } from '@/core/entity/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'entity/article.entity';
import { CreateArticleReq, GetArticlesReq } from 'interface/article';
import { PaginationData, PaginationOptions } from 'interface/common';
import { DeleteResult, getRepository, Repository } from 'typeorm';
// tslint:disable-next-line: no-var-requires
const slugify = require('slug');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ClassificationEntity)
    private readonly classificationRepository: Repository<ClassificationEntity>
  ) {}

  /**
   * 获取文章列表
   *
   */
  async findAll(query: GetArticlesReq): Promise<PaginationData<ArticleEntity>> {
    const { index = 1, size = 10 }: PaginationOptions = query || {};
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.classification', 'classification');
    qb.where('1 = 1');

    qb.orderBy('article.created', 'DESC');
    const total = await qb.getCount();
    qb.limit(size);
    qb.offset(index - 1);
    const list: ArticleEntity[] = await qb.getMany();
    return { index, size, list, total };
  }

  /**
   * 获取文章详情
   *
   */
  async findOne(slug: string): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ slug });
    return article;
  }

  /**
   * 创建
   *
   */
  async create(
    userId: number,
    articleData: CreateArticleReq
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();
    article.title = articleData.title;
    article.slug = this.slugify(articleData.title);
    article.description = articleData.description;
    article.content = articleData.content;
    const author = await this.userRepository.findOne({ id: userId });
    if (!author) {
      throw new HttpException('该author不存在', HttpStatus.BAD_REQUEST);
    }
    article.author = await this.userRepository.findOne({ id: userId });

    const classification = await this.classificationRepository.findOne({
      id: articleData.classificationId
    });
    if (classification) {
      article.classification = classification;
    }
    const newArticle = await this.articleRepository.save(article);
    return newArticle;
  }

  /**
   * 编辑
   *
   */
  async update(
    slug: string,
    articleData: CreateArticleReq
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ slug });
    if (!article) {
      throw new HttpException('该文章不存在', HttpStatus.BAD_REQUEST);
    }
    const updatedArticle = await this.articleRepository.save({
      ...article,
      ...articleData
    });
    return updatedArticle;
  }
  /**
   * 删除
   *
   */
  async delete(slug: string): Promise<DeleteResult> {
    return this.articleRepository.delete({ slug });
  }
  slugify(title: string) {
    // tslint:disable-next-line:no-bitwise
    return (
      slugify(title, { lower: true }) +
      '-' +
      (Math.random() * Math.pow(36, 6)).toString(36)
    );
  }
}
