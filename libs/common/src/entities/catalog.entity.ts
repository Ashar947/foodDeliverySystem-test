import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'catalog',
})
export class Catalog extends Model<Catalog> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    defaultValue: null,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2), // two decimal places
    allowNull: false,
  })
  amount: number;
}
