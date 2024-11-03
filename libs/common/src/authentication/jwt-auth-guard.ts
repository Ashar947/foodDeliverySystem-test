import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { catchError, map, retry, tap } from 'rxjs/operators';
import { ClientKafka } from '@nestjs/microservices';
import { User } from '../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  constructor(
    @Inject('auth-service') private readonly authClient: ClientKafka,
  ) {}

  async onModuleInit() {
    try {
      await this.authClient.connect();
      console.log('Connected to Auth');
      this.authClient.subscribeToResponseOf('authenticate');
      this.authClient.subscribeToResponseOf('authenticate.reply');
    } catch (error) {
      console.error('Failed to connect to Auth:', error);
    }
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request ? 'Request TRUE' : 'Request FALSE');
    this.onModuleInit();
    if (!request || !request.headers.authorization) {
      console.log('Request is missing or Authorization header is missing');
      return false;
    }

    console.log('authorization:', request.headers.authorization);

    return this.authClient
      .send<User>('authenticate', {
        headers: {
          authorization: request.headers.authorization,
        },
      })
      .pipe(
        retry(3), // Retry logic
        tap((res) => {
          if (res) {
            console.log('Authenticated User:', res);
            request.user = res; // Attach authenticated user to request
          } else {
            console.log('Authentication failed - No response received');
          }
        }),
        map((res) => !!res), // Map to boolean based on the response
        catchError((err) => {
          console.log('Error during authentication', err);
          return of(false); // Return false on error
        }),
      );
  }
}
