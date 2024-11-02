import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../../../../libs/common/src/entities/user.entity';

@Table
export class UserToken extends Model<UserToken> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  accessToken: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  refreshToken: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  validity: number;

  @BelongsTo(() => User)
  user: User;
}
