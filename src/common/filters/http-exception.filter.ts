import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiCustomResponse } from '../response/ApiRespone';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const defaultStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const defaultMessage = 'Lỗi máy chủ nội bộ';

    let status = defaultStatus;
    let rawMessage: string | string[] = defaultMessage;
    let errors: any = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        rawMessage = res;
      } else {
        rawMessage = (res as any).message ?? defaultMessage;
        errors = (res as any).error ?? undefined;
      }
    } else if (exception instanceof Error) {
      rawMessage = exception.message;
      errors = exception.stack;
    }

    // ✅ Chỉ lấy phần tử đầu nếu là mảng
    const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

    const errorResponse = {
      ...ApiCustomResponse.error(status, message, errors),
      method: request.method,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(errorResponse);
  }
}
