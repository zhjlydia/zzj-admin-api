import { ArticleEntity } from '../entity/article.entity';
export class ArticlesReq {
    readonly title: string;
    readonly description: string;
    readonly body: string;
    readonly tagList: string[];
  }
export interface ArticlesRes {
  articles: ArticleEntity[];
  articlesCount: number;
}
