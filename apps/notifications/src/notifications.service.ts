import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsService {
  // type OrderCreatedEvent
  orderCreation(data: any) {
    console.log('An Order Has Been Created.');
    console.log(data);
  }

  handleOrderStatus(data: any) {
    console.log('Order Status Updated.');
    console.log(data);
  }
}
