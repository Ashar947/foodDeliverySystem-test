import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Public } from '@app/common/decorator/public.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @MessagePattern('validate-dish')
  async validateDish(data: any) {
    return await this.restaurantService.validateDish(data.value);
  }

  @MessagePattern('validate-restaurant')
  async validateRestaurant(data: any) {
    return await this.restaurantService.validateRestaurant(data);
  }

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
  async findOne(@Param() id: string) {
    const { restaurant } = await this.restaurantService.findOne(+id);
    return {
      data: { restaurant },
      success: true,
      message: 'Restaurant Found Successfully.',
    };
  }
}
