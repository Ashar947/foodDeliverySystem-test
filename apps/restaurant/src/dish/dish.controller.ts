import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DishService } from './dish.service';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { AuthGuard } from '@app/common/authentication/auth.guard';
import { Roles } from '@app/common/constants/role.constants';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { Public } from '@app/common/decorator/public.decorator';

@Controller('dish')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @UseGuards(AuthGuard)
  @Roles(UserTypesEnum.RESTAURANT_ADMIN)
  @Post()
  async create(@Body() createDishDto: CreateDishDto) {
    const { dish } = await this.dishService.create(createDishDto);
    return {
      data: { dish },
      success: true,
      message: 'Dish Created Successfully.',
    };
  }

  @Get()
  findAll() {
    return this.dishService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dishService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDishDto: UpdateDishDto) {
    return this.dishService.update(+id, updateDishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dishService.remove(+id);
  }
}
