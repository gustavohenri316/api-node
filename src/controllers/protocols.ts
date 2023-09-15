export interface HttpResponse<T> {
  statusCode: number;
  body: T | string | unknown;
}
export interface HttpRequest<B> {
  params?: string;
  headers?: unknown;
  body?: B;
}
