export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  skip: number;
  pageSize: number;
  totalPages: number;
}
