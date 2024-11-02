import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserToken } from './entity/userToken.entity';
import { User } from './entity/user.entity';

@Module({
  imports: [DatabaseModule, SequelizeModule.forFeature([User, UserToken])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
