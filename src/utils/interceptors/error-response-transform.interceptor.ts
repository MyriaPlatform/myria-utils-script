import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class ErrorResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<Response<T>> {
    const request: Express.Request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      catchError((error) => {
        request.logger = request.logger.child({
          errorMessage: error.message,
          errorStack: error.stack,
        });
        return throwError(error);
      })
    );
  }
}
