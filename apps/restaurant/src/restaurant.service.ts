import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Restaurant } from './resturant.entity';

@Injectable()
export class RestaurantService {
  async create(createRestaurantDto: CreateRestaurantDto) {
    try {
      const restaurant = await Restaurant.create({
        ...createRestaurantDto,
        isActive: true,
        rating: 0.0,
        totalOrders: 0,
      });
      // call auth service to create user
      return { restaurant };
    } catch (error) {
      throw error;
    }
  }
  async findOne(id: number) {
    try {
      const restaurant = await Restaurant.findOne({ where: { id } });
      if (!restaurant) {
        throw new BadRequestException('Invalid Restaurant.');
      }
      return { restaurant };
    } catch (error) {
      throw error;
    }
  }
}
