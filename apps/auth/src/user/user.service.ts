import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { User } from '../../../../libs/common/src/entities/user.entity';

@Injectable()
export class UserService {
  async findOneById(userId: number) {
    try {
      const user = await User.findOne({
        where: {
          id: userId,
        },
      });
      return user;
    } catch {
      return null;
    }
  }

  async findAll() {
    const users = await User.findAll();
    return {
      success: true,
      message: 'Fetched All Users Successfully.',
      data: { users },
    };
  }

  async findOne(id: number, user: User) {
    try {
      const findUser: User | null = await this.findOneById(
        user.userType === UserTypesEnum.ADMIN ? id : user.id,
      );
      if (!findUser) {
        throw new BadRequestException('User Not Found.');
      }
      return {
        success: true,
        message: 'User Found Successfully.',
        data: { user: findUser },
      };
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }

  async updateUser(id: number, user: User, body: UpdateUserDto) {
    try {
      const userToUpdate = await User.findOne({
        where: {
          id,
        },
      });
      if (!userToUpdate) {
        throw new NotFoundException('Invalid User Selected.');
      }
      if (user.userType != 'admin' && user.id !== userToUpdate.id) {
        throw new UnauthorizedException('This Action Cannot Be Performed.');
      }
      const fields = ['name', 'contactNumber'];
      for (const field of fields) {
        user[field] = body['field'] ? body['field'] : user[field];
      }
      await user.save();
      return {
        success: true,
        message: 'User Updated Successfully.',
        data: { user: userToUpdate },
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: number, user: User) {
    try {
      const userToDelete = await User.findOne({
        where: {
          id,
        },
        attributes: ['id'],
      });
      if (!userToDelete) {
        throw new BadRequestException('Invalid User.');
      }
      // Check if user is deleting itself
      if (user.userType != 'admin' && user.id !== userToDelete.id) {
        throw new UnauthorizedException('This Action Cannot Be Performed.');
      }
      await userToDelete.destroy();
      return {
        success: true,
        message: 'User Deleted Successfully.',
        data: { user: userToDelete },
      };
    } catch (error) {
      throw error;
    }
  }
}
