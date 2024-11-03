import { NestFactory } from '@nestjs/core';
import { GatewayModule } from './gateway.module';
import { ConfigService } from '@nestjs/config';
import * as proxy from 'http-proxy-middleware';
import {
  HttpExceptionFilter,
  validationExceptionFactory,
} from '@app/common/exceptions';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  const configService = app.get(ConfigService);
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
  // app.setGlobalPrefix('api/v1');

  app.use(
    '/api/v1/auth',
    proxy({
      target: `http://auth:${configService.get('AUTH_HTTP_PORT')}/api/v1/auth`,
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '/api/v1/auth': '',
      },
      onProxyReq: (proxyReq, req) => {
        console.log(
          `[Global Functional Middlware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`,
        );
      },
    }),
  );
  app.use(
    '/api/v1/user',
    proxy({
      target: `http://auth:${configService.get('AUTH_HTTP_PORT')}`, // Use the Docker service name 'auth'
      changeOrigin: true,
      pathRewrite: {
        '/api/v1/user': '', // Optional: rewrite the path
      },
    }),
  );
  app.use(
    '/api/v1/catalog',
    proxy({
      target: `http://catalog:${configService.get('CATALOG_HTTP_PORT')}/api/v1/catalog`, // Use the Docker service name 'auth'
      changeOrigin: true,
      pathRewrite: {
        '/api/v1/catalog': '', // Optional: rewrite the path
      },
      onProxyReq: (proxyReq, req) => {
        console.log(
          `[Global Functional Middlware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`,
        );
      },
    }),
  );
  app.use(
    '/api/v1/orders',
    proxy({
      target: `http://orders:${configService.get('ORDER_HTTP_PORT')}/api/v1/orders`,
      changeOrigin: true,
      pathRewrite: {
        '/api/v1/orders': '', // Optional: rewrite the path
      },
      onProxyReq: (proxyReq, req) => {
        console.log(
          `[Global Functional Middlware]: Proxying ${req.method} request originally made to '${req.originalUrl}'...`,
        );
      },
    }),
  );
  const port = configService.get('GATEWAY_HTTP_PORT');
  await app.listen(port);
  console.log(`Gateway Running At http://host.docker.internal:${port}/api/v1`);
}
bootstrap();
