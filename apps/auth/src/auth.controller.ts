import { AuthService } from './auth.service';
import { LoginDto } from './user/dto/loginUser.dto';
import { Controller, Post, Body, Delete, UseGuards, Get } from '@nestjs/common';
import { Public } from '@app/common/decorator/public.decorator';
import { CreateUserDto } from './user/dto/createUser.dto';
import { LogoutUserDto } from './user/dto/logoutUser.dto';
import { AuthGuard } from '../guards/auth.guard';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { UserRequest } from '@app/common/database/interfaces/dbConfig.interface';
// import { AuthGuard } from 'apps/auth/guards/auth.guard';
// import { Roles } from '@app/common/constants/role.constants';
// import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
// import { UserRequest } from '@app/common/database/interfaces/dbConfig.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @EventPattern('authenticate')
  async authenticate(@Payload() req: UserRequest) {
    try {
      return req.user;
    } catch {
      return null;
    }
  }

  @Public()
  @Post('login')
  async login(@Body() loginUserDto: LoginDto) {
    return await this.authService.login(loginUserDto);
  }

  @Public()
  @Post('sign-up')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Public()
  @Delete('log-out')
  async logOutUser(@Body() logoutUserDto: LogoutUserDto) {
    return await this.authService.logOutUser(logoutUserDto);
  }
  @Public()
  @Get('health')
  healthCheck() {
    console.log('health check auth');
    console.log('health check auth');
    return { status: 'OK' };
  }
}