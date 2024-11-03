import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  HttpExceptionFilter,
  validationExceptionFactory,
} from '@app/common/exceptions';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { NotificationsModule } from './notifications.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'notification-client',
        brokers: [configService.get('BROKER')],
      },
      consumer: {
        groupId: configService.get('NOTIFICATION_CONSUMER'),
      },
    },
  });

  app.enableCors({
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );
  app.setGlobalPrefix('api/v1');
  await app.startAllMicroservices();
  await app.listen(configService.get('NOTIFICATION_HTTP_PORT'));
  console.log(
    `Notification Service Running On Port HTTP : ${configService.get('NOTIFICATION_HTTP_PORT')}`,
  );
}
bootstrap();
