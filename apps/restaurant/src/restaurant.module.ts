import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { DishModule } from './dish/dish.module';
import { RatingModule } from './rating/rating.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './resturant.entity';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    DishModule,
    RatingModule,
    DatabaseModule,
    SequelizeModule.forFeature([Restaurant]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        ACCESS_SECRET: Joi.string().required(),
        REFRESH_SECRET: Joi.string().required(),
        JWTKEY: Joi.string().required(),
        JWT_RESET_PASSWORD: Joi.string().required(),
        BEARER: Joi.string().required(),
        TOKEN_EXPIRATION: Joi.string().required(),
        JWT_INVITE_LINK_TOKEN: Joi.string().required(),
        BROKER: Joi.string().required(),
        RESTAURANT_CONSUMER: Joi.string().required(),
        RESTAURANT_HTTP_PORT: Joi.number().required(),
      }),
    }),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
