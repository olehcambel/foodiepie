import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Response.Success<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response.Success<T>> {
    return next.handle().pipe(
      map((data) => {
        return { data, status: 'success' };
      }),
    );
  }
}
