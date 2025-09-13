export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  pageSize: number;
  totalPages: number;
  page: number;
}

export const buildPaginationMeta = (
  totalItems: number,
  itemCount: number,
  page: number,
  pageSize: number,
): PaginationMeta => {
  return {
    totalItems,
    itemCount,
    pageSize,
    page,
    totalPages: Math.ceil(totalItems / pageSize),
  };
};
