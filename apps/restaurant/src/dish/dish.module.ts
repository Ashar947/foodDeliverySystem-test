import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Dish } from './entities/dish.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([Dish]),
    ClientsModule.registerAsync([
      {
        name: 'auth-service',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: configService.getOrThrow<string>('AUTH_CLIENT'),
              brokers: [configService.getOrThrow<string>('BROKER')],
            },
            consumer: {
              groupId: configService.getOrThrow<string>('AUTH_CONSUMER'),
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [DishController],
  providers: [DishService],
})
export class DishModule {}
