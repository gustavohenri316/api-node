import { HttpResponse } from "./protocols";

export const error = (message: string, status = 400): HttpResponse<string> => {
  return {
    statusCode: status,
    body: message,
  };
};

export const success = (body: unknown, status = 200): HttpResponse<unknown> => {
  return {
    statusCode: status,
    body: body,
  };
};
export const created = (body: unknown): HttpResponse<unknown> => {
  return {
    statusCode: 201,
    body: body,
  };
};
