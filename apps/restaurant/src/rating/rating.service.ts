import { Injectable } from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { UpdateRatingDto } from './dto/update-rating.dto';
import { Rating, RatingTypeEnum } from './entities/rating.entity';
import { User } from '@app/common/entities/user.entity';
import { Dish } from '../dish/entities/dish.entity';
import { Sequelize } from 'sequelize';
import { Restaurant } from '../resturant.entity';

@Injectable()
export class RatingService {
  async create(createRatingDto: CreateRatingDto, user: User) {
    try {
      // update overall dish/restaurant rating
      const rating = await Rating.create({
        ...createRatingDto,
        userId: user.id,
        ratingType: createRatingDto.orderId
          ? RatingTypeEnum.ORDER
          : RatingTypeEnum.DISH,
      });
      return { rating };
    } catch (error) {
      throw error;
    }
  }

  async updateDishRating(dishId: number) {
    try {
      const result = await Rating.findOne({
        attributes: [
          [
            Sequelize.fn(
              'ROUND',
              Sequelize.fn('AVG', Sequelize.col('rating')),
              1,
            ),
            'averageRating',
          ],
        ],
        where: { dishId },
        raw: true,
      });

      const averageRating = result['averageRating'] || 0.0;

      await Dish.update({ rating: averageRating }, { where: { id: dishId } });

      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  async updateRestaurantRating(restaurantId: number) {
    try {
      const result = await Rating.findOne({
        attributes: [
          [
            Sequelize.fn(
              'ROUND',
              Sequelize.fn('AVG', Sequelize.col('rating')),
              1,
            ),
            'averageRating',
          ],
        ],
        where: { restaurantId },
        raw: true,
      });

      const averageRating = result['averageRating'] || 0.0;

      await Restaurant.update(
        { rating: averageRating },
        { where: { id: restaurantId } },
      );

      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }

  findAll() {
    return `This action returns all rating`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rating`;
  }

  update(id: number, updateRatingDto: UpdateRatingDto) {
    console.log(updateRatingDto);
    return `This action updates a #${id} rating`;
  }

  remove(id: number) {
    return `This action removes a #${id} rating`;
  }
}
