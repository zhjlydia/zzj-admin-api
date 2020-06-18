import { PaginationOptions } from 'interface/common';
export interface CreateArticleReq {
  title: string;
  description: string;
  content: string;
  classificationId?: number;
}

export interface GetArticlesReq extends PaginationOptions {
  search: string;
}
