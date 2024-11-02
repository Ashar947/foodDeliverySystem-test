import { User } from 'apps/auth/src/user/entity/user.entity';
import { Request as ExpressRequest } from 'express';

export interface IDatabaseConfigAttributes {
  username?: string;
  password?: string;
  database?: string;
  host?: string;
  port?: number | string;
  dialect?: string;
  urlDatabase?: string;
}

export interface IDatabaseConfig {
  development: IDatabaseConfigAttributes;
  test: IDatabaseConfigAttributes;
  production: IDatabaseConfigAttributes;
}

export interface UserRequest extends ExpressRequest {
  user?: User;
}

export { ExpressRequest };
