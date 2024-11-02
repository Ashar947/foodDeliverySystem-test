import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from './order.entity';
import { Catalog } from './catalog.entity';

@Table({
  tableName: 'subOrders',
})
export class SubOrder extends Model<SubOrder> {
  @ForeignKey(() => Catalog)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  catalogId: number;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  orderId: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  totalAmount: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantity: number;

  @BelongsTo(() => Order)
  order: Order;

  @BelongsTo(() => Catalog)
  catalog: Catalog;
}
