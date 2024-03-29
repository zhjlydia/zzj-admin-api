import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'core/entity/category.entity';
import { TagEntity } from 'core/entity/tag.entity';
import { UserEntity } from 'core/entity/user.entity';
import { ArticleVo } from 'core/models/article';
import { PaginationData } from 'core/models/common';
import { ArticleEntity } from 'entity/article.entity';
import { getRepository, Repository } from 'typeorm';
// tslint:disable-next-line: no-var-requires
const slugify = require('slug');

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  /**
   * 获取文章列表
   *
   */
  async findAll(
    index: number,
    size: number
  ): Promise<PaginationData<ArticleEntity>> {
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .select([
        'article.id',
        'article.title',
        'article.image',
        'article.description',
        'article.content',
        'article.createdAt',
        'article.updatedAt',
        'article.state',
        'author.id',
        'author.username',
        'author.image',
        'category.id',
        'category.title',
        'tag.id',
        'tag.content'
      ]);
    qb.where('article.isDeleted = 0');

    qb.orderBy('article.createdAt', 'DESC');
    const total = await qb.getCount();
    qb.take(size);
    qb.skip((index - 1) * size);
    const list: ArticleEntity[] = await qb.getMany();
    return { index, size, list, total };
  }

  /**
   * 获取文章详情
   *
   */
  async findOne(id: number): Promise<ArticleEntity> {
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .innerJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tag')
      .select([
        'article.id',
        'article.title',
        'article.image',
        'article.description',
        'article.content',
        'article.state',
        'article.createdAt',
        'article.updatedAt',
        'author.username',
        'author.image',
        'category.id',
        'category.title',
        'tag.id',
        'tag.content'
      ]);
    qb.where({ id });

    const article: ArticleEntity = await qb.getOne();
    return article;
  }

  /**
   * 创建文章
   *
   */
  async create(userId: number, articleData: ArticleVo): Promise<number> {
    const article = new ArticleEntity();
    article.title = articleData.title;
    article.image = articleData.image || '';
    article.slug = this.slugify(articleData.title);
    article.description = articleData.description;
    article.content = articleData.content;
    const author = await this.userRepository.findOne({ id: userId });
    if (!author) {
      throw new HttpException('该author不存在', HttpStatus.BAD_REQUEST);
    }
    article.author = author;

    const category = await this.categoryRepository.findOne({
      id: articleData.categoryId
    });
    if (category) {
      article.category = category;
    }
    if (articleData.tagIds && articleData.tagIds.length) {
      const existTags = await this.tagRepository.findByIds(articleData.tagIds);
      article.tags = existTags;
    } else {
      article.tags = [];
    }
    const newArticle = await this.articleRepository.save(article);
    return newArticle.id;
  }

  /**
   * 编辑文章
   *
   */
  async update(id: number, articleData: ArticleVo): Promise<void> {
    const article = await this.articleRepository.findOne({ id });
    if (!article) {
      throw new HttpException('该文章不存在', HttpStatus.BAD_REQUEST);
    }
    if (articleData.categoryId) {
      const category = await this.categoryRepository.findOne({
        id: articleData.categoryId
      });
      if (category) {
        article.category = category;
      }
    }
    if (articleData.tagIds) {
      const existTags = await this.tagRepository.findByIds(articleData.tagIds);
      article.tags = existTags;
    }
    await this.articleRepository.save(Object.assign(article, articleData));
  }
  /**
   * 删除
   *
   */
  async delete(id: number): Promise<void> {
    const article = await this.articleRepository.findOne({ id });
    if (!article) {
      throw new HttpException('该文章不存在', HttpStatus.BAD_REQUEST);
    }
    article.isDeleted = true;
    await this.articleRepository.save(article);
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
