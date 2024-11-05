import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Restaurant } from '../../resturant.entity';

export enum DishCategoryEnum {
  DESSERTS = 'desserts',
  DRINKS = 'drinks',
  STARTERS = 'starters',
}

export enum DishAvailabilityStatusEnum {
  AVAILABLE = 'available',
  OUT_OF_STOCK = 'outOfStock',
}

@Table({
  tableName: 'Dishes',
  timestamps: true, // Includes createdAt and updatedAt columns automatically
})
export class Dish extends Model<Dish> {
  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  restaurantId: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.ENUM(...Object.values(DishCategoryEnum)),
    allowNull: false,
  })
  category: DishCategoryEnum;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  discount: number;

  @Column({
    type: DataType.DECIMAL(2, 1),
    defaultValue: 0.0,
    allowNull: false,
  })
  rating: number;

  @Column({
    type: DataType.ENUM(...Object.values(DishAvailabilityStatusEnum)),
    allowNull: false,
  })
  availabilityStatus: DishAvailabilityStatusEnum;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  isActive: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  totalSold: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  preparationTime: number; // minutes

  // Define associations if needed
  @BelongsTo(() => Restaurant) // Example association, modify as needed
  restaurant: Restaurant;
}
