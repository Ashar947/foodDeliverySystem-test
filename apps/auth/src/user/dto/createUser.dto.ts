import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
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
