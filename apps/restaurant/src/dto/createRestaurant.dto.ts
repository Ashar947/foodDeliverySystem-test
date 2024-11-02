import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRestaurantAdminDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  contactNumber: string;

  @IsNotEmpty()
  @IsString()
  userType: UserTypesEnum;
}
export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  email?: string;

  @IsNotEmptyObject()
  @IsObject()
  restaurantAdmin: CreateRestaurantAdminDto;
}
