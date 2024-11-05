import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Restaurant } from './resturant.entity';
import { Op } from 'sequelize';
import { Dish } from './dish/entities/dish.entity';
import { CreateRestaurantAdminEvent } from './dto/create-restaurant-event.dto';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class RestaurantService implements OnModuleInit {
  constructor(
    @Inject('auth-service')
    private readonly authService: ClientKafka,
  ) {}
  async onModuleInit() {
    await this.authService.connect();
  }
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
      // TODO Add RestaurantId
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
      console.log({ dish });
      return dish['dataValues'];
    } catch {
      return null;
    }
  }
  async validateRestaurant(data: any) {
    try {
      const restaurant = await Restaurant.findOne({
        where: { id: data.restaurantId },
      });
      console.log({ restaurant });
      return restaurant;
    } catch {
      return null;
    }
  }

  async updateDishSales({ id, quantity }: { id: number; quantity: number }) {
    const dish = await this.validateDish(id);
    if (dish) {
      dish.totalSold += quantity;
      await dish.save();
    }
  }
  async updateRestaurant({ id }: { id: number }) {
    const restaurant = await this.validateRestaurant(id);
    if (restaurant) {
      restaurant.totalOrders += 1;
      await restaurant.save();
    }
  }

  async getTopPopularDishes(id: number) {
    console.log({ id });
    const weight1 = 0.7; // weight for rating
    const weight2 = 0.3; // weight for totalSold
    const dishes = await Dish.findAll({
      where: { restaurantId: id },
      attributes: {
        include: [
          [
            Dish.sequelize.literal(
              `(rating * ${weight1} + totalSold * ${weight2})`,
            ),
            'popularityScore',
          ],
        ],
      },
      order: [[Dish.sequelize.literal('popularityScore'), 'DESC']],
      limit: 5,
    });
    return { dishes };
  }
}
