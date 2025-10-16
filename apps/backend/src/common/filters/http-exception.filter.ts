import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('🚨 EXCEPTION FILTER - Error capturado:');
    console.error('- URL:', request.method, request.url);
    console.error('- Body:', request.body);
    console.error('- Exception type:', exception.constructor.name);
    console.error('- Exception:', exception);
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any).message || message;
      
      console.error('- HTTP Exception Status:', status);
      console.error('- HTTP Exception Response:', exceptionResponse);
    } else if (exception instanceof Error) {
      console.error('- Error message:', exception.message);
      console.error('- Error stack:', exception.stack);
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
    };

    console.error('- Response sent:', errorResponse);

    response.status(status).json(errorResponse);
  }
}