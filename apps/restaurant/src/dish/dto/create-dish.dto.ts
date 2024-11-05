import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import {
  DishAvailabilityStatusEnum,
  DishCategoryEnum,
} from '../entities/dish.entity';

export class CreateDishDto {
  @IsNotEmpty()
  @IsInt()
  restaurantId: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  category: DishCategoryEnum;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  preparationTime: number;

  @IsNotEmpty()
  @IsString()
  availabilityStatus: DishAvailabilityStatusEnum;
}
