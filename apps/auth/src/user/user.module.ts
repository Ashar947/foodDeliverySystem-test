import { DatabaseModule } from '@app/common/database/database.module';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserToken } from './entity/userToken.entity';

@Module({
  imports: [DatabaseModule, SequelizeModule.forFeature([UserToken])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
