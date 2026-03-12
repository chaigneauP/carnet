import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';

type HttpRequestShape = {
  method: string;
  originalUrl: string;
};

type HttpResponseShape = {
  headersSent?: boolean;
  status(code: number): HttpResponseShape;
  json(payload: unknown): unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<HttpRequestShape>();
    const response = http.getResponse<HttpResponseShape>();

    if (response.headersSent) {
      return;
    }

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json(this.buildPayload(exception, request));
  }

  private buildPayload(exception: unknown, request: HttpRequestShape) {
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (this.isStructuredErrorResponse(exceptionResponse)) {
        if (exception instanceof NotFoundException && exception.message.startsWith('Cannot ')) {
          return {
            message: `Route not found: ${request.method} ${request.originalUrl}`,
          };
        }

        if (Array.isArray(exceptionResponse.message) && typeof exceptionResponse.message[0] === 'string') {
          return {
            message: exceptionResponse.message[0],
          };
        }

        if (typeof exceptionResponse.message === 'string' && Object.keys(exceptionResponse).length <= 3) {
          return {
            message: exceptionResponse.message,
          };
        }

        return exceptionResponse;
      }

      if (typeof exceptionResponse === 'string') {
        return {
          message: exceptionResponse,
        };
      }

      return {
        message: exception.message,
      };
    }

    if (exception instanceof Error) {
      return {
        message: exception.message,
      };
    }

    return {
      message: 'Internal server error',
    };
  }

  private isStructuredErrorResponse(value: unknown): value is Record<string, unknown> & { message?: unknown } {
    return typeof value === 'object' && value !== null;
  }
}
