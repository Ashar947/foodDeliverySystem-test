import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsOptional()
  @IsInt()
  orderId: number;

  @IsNotEmpty() // IsNotEmpty
  @IsInt()
  restaurantId: number;

  @IsOptional()
  @IsInt()
  dishId: number;

  @IsNotEmpty()
  @IsInt()
  rating: number;
}
