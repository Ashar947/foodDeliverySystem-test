import { User } from '@app/common/entities/user.entity';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Dish } from '../../dish/entities/dish.entity';
import { Restaurant } from '../../resturant.entity';

export enum RatingTypeEnum {
  ORDER = 'order',
  DISH = 'dish',
}

@Table
export class Rating extends Model<Rating> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  //   @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  orderId: number;

  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  restaurantId: number;

  @ForeignKey(() => Dish)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  dishId: number;

  @Column({
    type: DataType.ENUM(...Object.values(RatingTypeEnum)),
    allowNull: false,
  })
  ratingType: RatingTypeEnum;

  @Column({
    type: DataType.DECIMAL(2, 1),
    allowNull: false,
  })
  rating: number;
}
