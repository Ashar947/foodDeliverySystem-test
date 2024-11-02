import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/createRestaurant.dto';
import { Public } from '@app/common/decorator/public.decorator';
import { JwtAuthGuard } from '@app/common/authentication/jwt-auth-guard';
import { Roles } from '@app/common/constants/role.constants';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { UserRequest } from '@app/common/database/interfaces/dbConfig.interface';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Public()
  // @UseGuards(JwtAuthGuard)
  // @Roles(UserTypesEnum.CUSTOMER)
  @Post()
  async create(
    @Body() createRestaurantDto: CreateRestaurantDto,
    // @Request() req: UserRequest,
  ) {
    // const user = req.user;
    // console.log({ user });
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
