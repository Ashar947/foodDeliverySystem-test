import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

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
