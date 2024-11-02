import { IsInt, IsNotEmpty, IsString } from 'class-validator';
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
  @IsString()
  price: number;

  @IsNotEmpty()
  @IsString()
  availabilityStatus: DishAvailabilityStatusEnum;
}
