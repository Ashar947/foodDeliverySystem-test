import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '@app/common/decorator/public.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    console.log('Request AUTH GUARD');
    // console.log({request})
    const token = this.extractTokenFromHeader(request);
    // console.log({token})
    console.log('Request AUTH GUARD TOKEN' + token + 'END');
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.ACCESS_SECRET,
      });
      const userId = payload.userId;
      const user = await User.findByPk(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      // if (!user.isActive) {
      //   throw new UnauthorizedException('Your Account Has Been Deactivated .');
      // }
      request.user = user;
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
