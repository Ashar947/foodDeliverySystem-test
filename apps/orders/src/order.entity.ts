import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { SubOrder } from './sub-orders/entities/sub-order.entity';

export enum OrderStatusEnum {
  PREPARATION = 'preparation',
  ON_THE_WAY = 'onTheWay',
  DELIVERED = 'delivered',
  CUSTOMER_CANCELLED = 'customerCancelled',
  RESTAURANT_CANCELLED = 'restaurantCancelled',
}

@Table
export class Order extends Model<Order> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  restaurantId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  })
  totalOrderAmount: number;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatusEnum)),
    allowNull: false,
    defaultValue: OrderStatusEnum.PREPARATION,
  })
  status: OrderStatusEnum;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  orderNotes: string;

  @HasMany(() => SubOrder)
  subOrders: SubOrder[];
}
