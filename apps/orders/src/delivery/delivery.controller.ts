import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { AuthGuard } from '@app/common/authentication/auth.guard';
import { Roles } from '@app/common/constants/role.constants';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // complete delivery
  @UseGuards(AuthGuard)
  @Roles(UserTypesEnum.RIDER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    // @Body() updateDeliveryDto: UpdateDeliveryDto,
    // @Request() req: UserRequest,
  ) {
    const { delivery } = await this.deliveryService.completeRide(+id);
    return {
      data: { delivery },
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('deliverTime/:time')
  async averageDeliveryTime(@Param('time') time: 'daily' | 'weekly') {
    // @Query('time') time: 'daily' | 'weekly'
    const { deliveries } = await this.deliveryService.averageDeliveryTime(time);
    return {
      data: { deliveries },
      success: true,
      message: 'Deliveries Average Time Calculated .',
    };
  }
}
