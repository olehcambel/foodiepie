import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response } from 'express';

const log = console;

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const resp = ctx.getResponse<Response>();
    // const req = ctx.getRequest<Request>();
    const httpException = this.getException(exception);
    const errors = this.getValidationErr(httpException);
    const body: Response.Fail = {
      status: 'failure',
      message: httpException.message,
      errors,
    };

    resp.status(httpException.getStatus()).json(body);
  }

  getValidationErr(exception: HttpException): undefined | string[] {
    const resp = exception.getResponse() as /* string | */ {
      message?: string[];
    };

    if (Array.isArray(resp.message)) {
      return resp.message;
    }
  }

  getException(err: Error /*req: Request*/): HttpException {
    if (
      err instanceof HttpException &&
      !(err instanceof InternalServerErrorException)
    ) {
      return err;
    }

    log.error(err);
    // TODO: log to sentry
    return new InternalServerErrorException();
  }
}
