import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { DishModule } from './dish/dish.module';
import { RatingModule } from './rating/rating.module';
import { DatabaseModule } from '@app/common/database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Restaurant } from './resturant.entity';

@Module({
  imports: [
    DishModule,
    RatingModule,
    DatabaseModule,
    SequelizeModule.forFeature([Restaurant]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
