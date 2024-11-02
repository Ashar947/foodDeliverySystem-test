import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { Column, DataType, Model, Table } from 'sequelize-typescript';
// import { RiderInformation } from '../../rider-information/entity/rider-information.entity';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contactNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserTypesEnum)),
    allowNull: false,
  })
  userType: UserTypesEnum;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  resetLink: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  verified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  isActive: boolean;

  // @HasOne(() => RiderInformation)
  // riderInformation: RiderInformation;
}
