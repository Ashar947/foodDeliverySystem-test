import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
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
    return await this.deliveryService.completeRide(+id);
  }
}
