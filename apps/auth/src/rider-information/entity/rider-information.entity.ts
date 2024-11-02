import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../../../../libs/common/src/entities/user.entity';

@Table
export class RiderInformation extends Model<RiderInformation> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
  })
  userId: number;

  // @Column({
  //   type: DataType.GEOGRAPHY('POINT'),
  //   allowNull: true,
  // })
  // currentLocation: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  citizenNumber: string;

  // @BelongsTo(() => User)
  // user: User;
}
