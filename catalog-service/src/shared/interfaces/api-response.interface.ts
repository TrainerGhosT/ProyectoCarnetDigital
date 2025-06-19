export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  total?: number;
  errors?: string[];
}