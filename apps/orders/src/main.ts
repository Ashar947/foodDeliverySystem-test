import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import {
  HttpExceptionFilter,
  validationExceptionFactory,
} from '@app/common/exceptions';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('Order Service Started ..');
  const app = await NestFactory.create(OrdersModule);
  const configService = app.get(ConfigService);
  await app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URL')],
      queue: 'orders-queue',
      noAck: false,
      queueOptions: {
        durable: true, // Ensure durability if needed
      },
    },
  });
  app.useGlobalFilters(new HttpExceptionFilter());
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

  await app.listen(configService.get('ORDER_HTTP_PORT'));
  console.log(
    `Order App Running At  http: ${configService.get('ORDER_HTTP_PORT')} tcp: ${configService.get('ORDER_TCP_PORT')}`,
  );
}
bootstrap();
