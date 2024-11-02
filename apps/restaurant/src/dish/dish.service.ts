import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { Dish } from './entities/dish.entity';

@Injectable()
export class DishService {
  async create(createDishDto: CreateDishDto) {
    try {
      const dish = await Dish.create({
        ...createDishDto,
        discount: 0.0,
        rating: 0.0,
        isActive: true,
        totalSold: 0,
      });
      return { dish };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return `This action returns all dish`;
  }

  async findOne(id: number) {
    try {
      const dish = await Dish.findOne({ where: { id } });
      if (!dish) {
        throw new NotFoundException('Dish Not Found.');
      }
      return { dish };
    } catch (error) {
      throw error;
    }
  }

  update(id: number, updateDishDto: UpdateDishDto) {
    console.log(updateDishDto);
    return `This action updates a #${id} dish`;
  }

  remove(id: number) {
    return `This action removes a #${id} dish`;
  }
}
