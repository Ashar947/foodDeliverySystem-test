import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Restaurant } from './resturant.entity';
import { Op } from 'sequelize';
import { Dish } from './dish/entities/dish.entity';
import { CreateRestaurantAdminEvent } from './dto/create-restaurant-event.dto';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('auth-service')
    private readonly authService: ClientKafka,
  ) {}
  async create({ restaurantAdmin, ...rest }: CreateRestaurantDto) {
    try {
      const checkWhere: any[] = [];
      if (rest.email) {
        checkWhere.push({ email: rest.email });
      }
      if (rest.contactNumber) {
        checkWhere.push({ contactNumber: rest.contactNumber });
      }
      if (checkWhere.length > 0) {
        const checkRestaurant = await Restaurant.findOne({
          where: {
            [Op.or]: checkWhere,
          },
          attributes: ['id'],
        });
        if (checkRestaurant) {
          throw new BadRequestException('Restaurant Already Exist.');
        }
      }
      const restaurant = await Restaurant.create({
        ...rest,
        isActive: true,
        rating: 0.0,
        totalOrders: 0,
      });
      // call auth service to create user
      this.authService.emit(
        'create-user',
        new CreateRestaurantAdminEvent(
          restaurantAdmin.name,
          restaurantAdmin.email,
          restaurantAdmin.password,
          UserTypesEnum.RESTAURANT_ADMIN,
        ),
      );
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

  async validateDish(data: any) {
    try {
      const dish = await Dish.findOne({ where: { id: data.dishId } });
      return dish ? dish : null;
    } catch {
      return null;
    }
  }
  async validateRestaurant(data: any) {
    try {
      const dish = await Restaurant.findOne({
        where: { id: data.restaurantId },
      });
      console.log(dish)
      return dish ? dish : null;
    } catch {
      return null;
    }
  }
}
