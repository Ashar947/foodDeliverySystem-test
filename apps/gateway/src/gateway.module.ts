import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        AUTH_HTTP_PORT: Joi.number().required(),
        AUTH_TCP_PORT: Joi.number().required(),
        CATALOG_HTTP_PORT: Joi.number().required(),
        CATALOG_TCP_PORT: Joi.number().required(),
        GATEWAY_HTTP_PORT: Joi.number().required(),
        ORDER_HTTP_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
