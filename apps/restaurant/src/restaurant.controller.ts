import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Public } from '@app/common/decorator/public.decorator';
import { EventPattern, MessagePattern } from '@nestjs/microservices';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Public()
  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    const { restaurant } =
      await this.restaurantService.create(createRestaurantDto);
    return {
      data: { restaurant },
      success: true,
      message: 'Restaurant Created Successfully.',
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const { restaurant } = await this.restaurantService.findOne(id);
    return {
      data: { restaurant },
      success: true,
      message: 'Restaurant Found Successfully.',
    };
  }

  @Public()
  @Get('popularDishes/:id')
  async getTopPopularDishes(@Param('id', ParseIntPipe) id: number) {
    const { dishes } = await this.restaurantService.getTopPopularDishes(id);
    return {
      data: { dishes },
      success: true,
      message: 'Dishes Retrieved Successfully.',
    };
  }

  @MessagePattern('validate-dish')
  async validateDish(data: any) {
    return await this.restaurantService.validateDish(data);
  }

  @EventPattern('update-dish-sales')
  updateDishSales(data: any) {
    this.restaurantService.updateDishSales(data);
  }

  @EventPattern('update-restaurant-sales')
  updateRestaurantSales(data: any) {
    this.restaurantService.updateRestaurant(data);
  }

  @MessagePattern('validate-restaurant')
  async validateRestaurant(data: any) {
    return await this.restaurantService.validateRestaurant(data);
  }
}
