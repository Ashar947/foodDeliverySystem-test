import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Dish } from './dish/entities/dish.entity';

@Table
export class Restaurant extends Model<Restaurant> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  // @Column({
  //     type : DataType.GEOGRAPHY("POINT"),
  //     allowNull : true
  // })
  // location :any

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contactNumber: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.DECIMAL(2, 1),
    allowNull: false,
    defaultValue: 0.0,
  })
  rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  totalOrders: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;

  @HasMany(() => Dish)
  dishes: Dish[];
}
