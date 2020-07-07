/**
 * 列表
 */
export interface PaginationData<T> {
  /**
   * 数据列表
   */
  list: T[];
  /**
   * 当前页数
   */
  index: number;
  /**
   * 分页大小
   */
  size: number;
  /**
   * 总数
   */
  total: number;
}
