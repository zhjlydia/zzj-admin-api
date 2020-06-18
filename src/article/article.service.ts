import { ClassificationEntity } from '@/core/entity/classification.entity';
import { TagEntity } from '@/core/entity/tag.entity';
import { UserEntity } from '@/core/entity/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'entity/article.entity';
import { CreateArticleReq, GetArticlesReq } from 'interface/article';
import { PaginationData } from 'interface/common';
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
    private readonly classificationRepository: Repository<ClassificationEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  /**
   * 获取文章列表
   *
   */
  async findAll(query: GetArticlesReq): Promise<PaginationData<ArticleEntity>> {
    const index: number = Number(query.index) || 1;
    const size: number = Number(query.size) || 10;
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.classification', 'classification')
      .leftJoinAndSelect('article.tags', 'tag')
      .select([
        'article.id',
        'article.title',
        'article.description',
        'article.content',
        'article.createdAt',
        'article.updatedAt',
        'author.username',
        'author.image',
        'classification.id',
        'classification.title',
        'tag.id',
        'tag.content'
      ]);
    qb.where('1 = 1');

    qb.orderBy('article.createdAt', 'DESC');
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
  async findOne(id: number): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOne({ id });
    return article;
  }

  /**
   * 创建
   *
   */
  async create(
    userId: number,
    articleData: CreateArticleReq,
    tags: number[]
  ): Promise<number> {
    const article = new ArticleEntity();
    article.title = articleData.title;
    article.slug = this.slugify(articleData.title);
    article.description = articleData.description;
    article.content = articleData.content;
    const author = await this.userRepository.findOne({ id: userId });
    if (!author) {
      throw new HttpException('该author不存在', HttpStatus.BAD_REQUEST);
    }
    article.author = author;

    const classification = await this.classificationRepository.findOne({
      id: articleData.classificationId
    });
    if (classification) {
      article.classification = classification;
    }
    if (tags && tags.length) {
      const existTags = await this.tagRepository.findByIds(tags);
      article.tags = existTags;
    } else {
      article.tags = [];
    }
    const newArticle = await this.articleRepository.save(article);
    return newArticle.id;
  }

  /**
   * 编辑
   *
   */
  async update(
    id: number,
    articleData: CreateArticleReq,
    tags: number[]
  ): Promise<number> {
    const article = await this.articleRepository.findOne({ id });
    if (!article) {
      throw new HttpException('该文章不存在', HttpStatus.BAD_REQUEST);
    }
    if (articleData.classificationId) {
      const classification = await this.classificationRepository.findOne({
        id: articleData.classificationId
      });
      if (classification) {
        article.classification = classification;
      }
    }
    if (tags) {
      const existTags = await this.tagRepository.findByIds(tags);
      article.tags = existTags;
    }
    await this.articleRepository.save({
      ...article,
      title: articleData.title,
      description: articleData.description,
      content: articleData.content
    });
    return id;
  }
  /**
   * 删除
   *
   */
  async delete(id: number): Promise<DeleteResult> {
    return this.articleRepository.delete({ id });
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
