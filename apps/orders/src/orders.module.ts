import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseModule } from '@app/common/database/database.module';
import { DeliveryModule } from './delivery/delivery.module';
import { SubOrdersModule } from './sub-orders/sub-orders.module';
import { Order } from './order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '@app/common/authentication/jwt-auth-guard';

@Module({
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([Order]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ORDER_HTTP_PORT: Joi.number().required(),
        ORDER_CLIENT: Joi.string().required(),
        ORDER_CONSUMER: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: 'auth-service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-client',
              brokers: [configService.getOrThrow<string>('BROKER')],
            },
            consumer: {
              groupId: configService.getOrThrow<string>('AUTH_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'restaurant-service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'restaurant-client',
              brokers: [configService.getOrThrow<string>('BROKER')],
            },
            consumer: {
              groupId: configService.getOrThrow<string>('RESTAURANT_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: 'notification-service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'notification-client',
              brokers: [configService.getOrThrow<string>('BROKER')],
            },
            consumer: {
              groupId: configService.getOrThrow<string>(
                'NOTIFICATION_CONSUMER',
              ),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    DeliveryModule,
    SubOrdersModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class OrdersModule {}
