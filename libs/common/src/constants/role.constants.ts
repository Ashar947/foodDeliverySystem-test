import { SetMetadata } from '@nestjs/common';
import { UserTypesEnum } from './roleTypes.enum';

export type Authorizer = UserTypesEnum;
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Authorizer[]) => SetMetadata(ROLES_KEY, roles);
