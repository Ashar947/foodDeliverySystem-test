import { NestFactory, Reflector } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import {
  HttpExceptionFilter,
  validationExceptionFactory,
} from '@app/common/exceptions';
import { UserService } from './user/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('BROKER')], //['localhost:9092'], // TODO: ADD IN ENV
      },
      consumer: {
        groupId: configService.get('AUTH_CONSUMER'), // ${configService.get('AUTH_HTTP_PORT')}
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
  app.useGlobalGuards(new AuthGuard(jwtService, userService, reflector));
  await app.startAllMicroservices();
  await app.listen(configService.get('AUTH_HTTP_PORT'));
  console.log(
    `Auth Service Running On Port HTTP : ${configService.get('AUTH_HTTP_PORT')}`,
  );
}
bootstrap();
