import { Catch, ArgumentsHost, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { Logger } from './logger.service';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {

  constructor(@Inject('Logger') private logger: Logger) {
    super();
  }

  private validationError(errors: any) {
    const _errors: Array<any> = [];

    Object.keys(errors).forEach((field: any) => {
      const _error: any = errors[field];
      _errors.push({
        [field]: _error.kind
      })
    });

    return {
      status: HttpStatus.BAD_REQUEST,
      errors: _errors
    };
  }

  private dupKey(info: any) {
    const errors: Array<any> = [];

    Object.keys(info).forEach((key: string) => {
      errors.push({
        [key]: `${info[key]} already exists.`
      });
    });

    return errors;
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp();

    const res: Response = ctx.getResponse<Response>(),
      req: Request = ctx.getRequest<Request>();


    console.log(exception);


    this.logger.error(exception as string);

    switch(exception.constructor.name) {
      case 'ValidationError':
        const { status, errors}: any = this.validationError(exception['errors']);
      
        return res.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors
        });

      case 'MongoError':
        const dup: boolean = exception['message'].indexOf('dup key') !== -1 ? true : false;
      
        return res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: dup ? this.dupKey(exception['keyValue']) : [{message: 'Something went wrong.'}]
        });

      case 'TokenExpiredError':
        return res.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{message: "Unauthorized."}]
        });

      case 'HttpException':
        const statusCode: number = (exception as HttpException).getStatus(),
          message: string = (exception as HttpException).message;
      
        return res.status(statusCode).json({
          statusCode,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{message}]
        });

      default:
        return res.status(500).json({
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: req.url,
          errors: [{message: "Something went wrong."}]
        });

    }
  }
}

