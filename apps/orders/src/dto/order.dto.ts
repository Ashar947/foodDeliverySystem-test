import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubOrderDto {
  @IsNotEmpty()
  @IsNumber()
  catalogId: number;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray()
  subOrders: CreateSubOrderDto[];
}
