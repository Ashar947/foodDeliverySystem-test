import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

interface HttpExceptionWithErrors extends HttpException {
  validationErrors: Record<string, string>;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpExceptionWithErrors, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const data = exception.getResponse() as Record<string, any>;
    const errors = exception.validationErrors;
    const { message } = data;
    response.status(status).json({
      statusCode: status,
      success: false,
      message: message,
      errors: errors, // This line will add the error object
    });
  }
}
