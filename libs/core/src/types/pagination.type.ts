export interface PaginationDto {
  readonly limit: number
  readonly page: number
}

export interface ReturnPaginationDto {
  readonly totalCount: number
  readonly totalPages: number
}
