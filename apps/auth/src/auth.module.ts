import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { RolesGuard } from '@app/common/decorator/role.guard';
import { AuthGuard } from '../guards/auth.guard';
import { RiderInformationModule } from './rider-information/rider-information.module';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    RiderInformationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCESS_SECRET: Joi.string().required(),
        REFRESH_SECRET: Joi.string().required(),
        JWTKEY: Joi.string().required(),
        JWT_RESET_PASSWORD: Joi.string().required(),
        BEARER: Joi.string().required(),
        TOKEN_EXPIRATION: Joi.string().required(),
        JWT_INVITE_LINK_TOKEN: Joi.string().required(),
        AUTH_HTTP_PORT: Joi.number().required(),
      }),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    JwtModule.register({
      global: true,
      secret: process.env.REFRESH_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule {}
