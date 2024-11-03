import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from '../../order.entity';

@Table({
  tableName: 'SubOrders',
  timestamps: false,
})
export class SubOrder extends Model<SubOrder> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  })
  id: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  dishId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  dishNote: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  totalPrice: number;

  @BelongsTo(() => Order)
  order: Order;
}
