import { Controller } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @EventPattern('update-order-status')
  updateOrderStatus(data: any) {
    this.notificationsService.handleOrderStatus(data.value);
  }

  @EventPattern('order-creation')
  orderCreation(data: any) {
    this.notificationsService.orderCreation(data.value);
  }
}
