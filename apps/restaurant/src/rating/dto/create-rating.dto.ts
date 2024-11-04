import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateRatingDto {
  @IsOptional()
  @IsNumber()
  orderId: number;

  @IsNotEmpty() // IsNotEmpty
  @IsNumber()
  restaurantId: number;

  @IsOptional()
  @IsNumber()
  dishId: number;

  @IsNotEmpty()
  @IsNumber()
  rating: number;
}
