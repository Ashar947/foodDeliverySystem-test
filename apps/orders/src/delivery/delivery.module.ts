import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Delivery } from './entities/delivery.entity';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule,
    DatabaseModule,
    SequelizeModule.forFeature([Delivery]),
    ClientsModule.registerAsync([
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
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
