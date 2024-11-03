import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        BROKER: Joi.string().required(),
        NOTIFICATION_CONSUMER: Joi.string().required(),
        NOTIFICATION_HTTP_PORT: Joi.number().required(),
        NOTIFICATION_CLIENT: Joi.string().required(),
      }),
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
