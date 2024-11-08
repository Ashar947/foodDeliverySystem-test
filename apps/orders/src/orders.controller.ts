import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Roles } from '@app/common/constants/role.constants';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { CreateOrderDto } from './dto/order.dto';
import { UserRequest } from '@app/common/database/interfaces/dbConfig.interface';
import { AuthGuard } from '@app/common/authentication/auth.guard';
import { Public } from '@app/common/decorator/public.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(AuthGuard)
  @Roles(UserTypesEnum.CUSTOMER)
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Request() req: UserRequest,
  ) {
    return await this.ordersService.create(createOrderDto, req.user);
  }

  @Public()
  @Get('peak-order-time')
  async analyzePeakOrderTime() {
    return {
      data: await this.ordersService.analyzePeakOrderTime(),
      success: true,
    };
  }
}
