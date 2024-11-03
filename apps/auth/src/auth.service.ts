import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginDto } from './user/dto/loginUser.dto';
import { CreateUserDto } from './user/dto/createUser.dto';
import { LogoutUserDto } from './user/dto/logoutUser.dto';
import { UserToken } from './user/entity/userToken.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { User } from '../../../libs/common/src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService, // Inject ConfigService
  ) {}
  async login({ email, password }: LoginDto) {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw new BadRequestException('User Does not Exist With This Email.');
      }
      const comparePassword: boolean = await bcrypt.compare(
        password,
        user.password,
      );

      if (!comparePassword) {
        throw new BadRequestException('Incorrect Password.');
      }

      user.setDataValue('password', undefined);

      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_SECRET,
        { expiresIn: '1d' },
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.REFRESH_SECRET,
        { expiresIn: '3d' },
      );

      await UserToken.create({
        userId: user.id,
        accessToken,
        refreshToken,
      });

      return {
        success: true,
        message: 'User Logged In Successfully.',
        data: { user, accessToken, refreshToken },
      };
    } catch (error) {
      throw error;
    }
  }
  async createUser(createUserDto: CreateUserDto) {
    try {
      const findUserByEmail = await User.findOne({
        where: {
          email: createUserDto.email,
        },
        attributes: ['id'],
      });
      if (findUserByEmail) {
        throw new BadRequestException('User Already Exist With This Email.');
      }
      console.log(await bcrypt.hash(createUserDto.password, 10));
      const user = await User.create({
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
      });
      const accessToken = jwt.sign(
        { userId: user.id },
        this.configService.get('ACCESS_SECRET'),
        { expiresIn: '1d' },
      );
      const refreshToken = jwt.sign(
        { userId: user.id },
        this.configService.get('ACCESS_SECRET'),
        { expiresIn: '3d' },
      );
      user.setDataValue('password', undefined);
      await UserToken.create({
        userId: user.id,
        accessToken,
        refreshToken,
      });
      return {
        success: true,
        message: 'User Created Successfully.',
        data: { user, accessToken, refreshToken },
      };
    } catch (error) {
      throw error;
    }
  }
  async logOutUser({ accessToken = null }: LogoutUserDto) {
    try {
      if (!accessToken) {
        throw new Error('');
      }
      const userToken = await UserToken.findOne({
        where: {
          accessToken,
        },
        include: [{ association: 'user' }],
      });
      if (!userToken) {
        throw new Error('');
      }
      await userToken.destroy();
      return { success: true, message: 'User Logged Out Successfully.' };
    } catch {
      return { success: true, message: 'User Logged Out Successfully.' };
    }
  }
}
