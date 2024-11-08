import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Authorizer, ROLES_KEY } from '../constants/role.constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Authorizer[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const userRole = request.user;
    try {
      return requiredRoles.some((authorizer) => authorizer === userRole.role);
    } catch (error) {
      // Handle any errors that might occur during the database query
      console.error(`Error fetching user role: ${error.message}`);
      return false;
    }
  }
}
