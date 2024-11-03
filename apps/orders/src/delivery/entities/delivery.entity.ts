import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from '../../order.entity';
import { User } from '@app/common/entities/user.entity';

@Table
export class Delivery extends Model<Delivery> {
  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  customerId: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  riderId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  deliveryAddress: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  estimatedDeliveryTime: string;

  @Column({
    type: DataType.TIME,
    allowNull: true,
  })
  realDeliveryTime: string;
}
