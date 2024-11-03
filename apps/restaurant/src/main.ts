import { NestFactory } from '@nestjs/core';
import { RestaurantModule } from './restaurant.module';
import { ConfigService } from '@nestjs/config';
import {
  HttpExceptionFilter,
  validationExceptionFactory,
} from '@app/common/exceptions';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'restaurant-client',
        brokers: [configService.get('BROKER')],
      },
      consumer: {
        groupId: configService.get('RESTAURANT_CONSUMER'),
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
  await app.listen(configService.get('RESTAURANT_HTTP_PORT'));
  console.log(
    `Restaurant Service Running On Port HTTP : ${configService.get('RESTAURANT_HTTP_PORT')}`,
  );
}
bootstrap();
