export interface HttpResponse<T> {
  statusCode: number;
  body: T | string | unknown;
}
export interface HttpRequest<B> {
  params?: B;
  headers?: {
    authorization?: string;
  };
  body?: B;
}

export interface IController {
  handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>>;
}
