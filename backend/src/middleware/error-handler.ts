import type { NextFunction, Request, Response } from 'express';

export function notFoundHandler(request: Request, response: Response) {
  return response.status(404).json({
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

export function errorHandler(error: unknown, _request: Request, response: Response, _next: NextFunction) {
  const statusCode =
    error instanceof Error && error.message.includes('limit')
      ? 400
      : 500;

  return response.status(statusCode).json({
    message: error instanceof Error ? error.message : 'Internal server error',
  });
}
