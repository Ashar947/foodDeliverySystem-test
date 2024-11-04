import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Delete,
  Request,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '@app/common/constants/role.constants';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { UserRequest } from '@app/common/database/interfaces/dbConfig.interface';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from '@app/common/authentication/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  @Roles(UserTypesEnum.ADMIN)
  //   async findAll(@Request() req: UserRequest) {
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  // @Roles(UserTypesEnum.ADMIN)
  async findOne(@Param('id') id: string, @Request() req: UserRequest) {
    console.log('here');
    return await this.userService.findOne(+id, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number, @Request() req: UserRequest) {
    return await this.userService.deleteUser(id, req.user);
  }
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Request() req: UserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(id, req.user, updateUserDto);
  }

  // Add more routes as needed
}
