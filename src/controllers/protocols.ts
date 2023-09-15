export interface HttpResponse<T> {
  statusCode: number;
  body: T | string | unknown;
}
export interface HttpRequest<B> {
  params?: B;
  headers?: unknown;
  body?: B;
}
