import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { ClientProxy } from '@nestjs/microservices';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject('auth-service') private readonly authClient: ClientProxy,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request ? 'Request TRUE' : 'Request FALSE');

    if (!request) {
      console.log('request is false');
      return false;
    }
    console.log('authorization : ', request.headers.authorization);
    return this.authClient
      .send<User>('authenticate', {
        headers: {
          authorization: request.headers.authorization,
        },
      })
      .pipe(
        retry(3),
        tap((res) => {
          console.log(res);
          context.switchToHttp().getRequest().user = res;
          // request.user = res; // Store the authenticated user in the request
          // this.authClient.emit('acknowledge', { acknowledged: true });

          return true;
        }),
        map(() => true),
        catchError((err) => {
          console.log('error', err);
          // this.authClient.emit('acknowledge', { acknowledged: false });
          return of(false); // Return false in case of an error
        }),
      );
  }
}
