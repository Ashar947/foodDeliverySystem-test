import { Module } from '@nestjs/common';
import { RatingService } from './rating.service';
import { RatingController } from './rating.controller';
import { DatabaseModule } from '@app/common/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rating } from './entities/rating.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    DatabaseModule,
    SequelizeModule.forFeature([Rating]),
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
  controllers: [RatingController],
  providers: [RatingService],
})
export class RatingModule {}
