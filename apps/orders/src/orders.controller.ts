import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '@app/common/authentication/jwt-auth-guard';
import { Roles } from '@app/common/constants/role.constants';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { CreateOrderDto } from './dto/order.dto';
import { UserRequest } from '@app/common/database/interfaces/dbConfig.interface';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserTypesEnum.CUSTOMER)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: UserRequest,
  ) {
    return await this.ordersService.create(createOrderDto, req.user);
  }
}
