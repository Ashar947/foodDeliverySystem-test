import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubOrderDto {
  @IsNotEmpty()
  @IsInt()
  dishId: number;

  @IsNotEmpty()
  @IsString()
  dishNote: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  deliveryAddress: string;

  @IsNotEmpty()
  @IsInt()
  restaurantId: number;

  @IsOptional()
  @IsString()
  orderNotes: string;

  @IsNotEmpty()
  @IsArray()
  subOrders: CreateSubOrderDto[];
}
