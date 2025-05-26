// Shared types that are used across multiple modules
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}