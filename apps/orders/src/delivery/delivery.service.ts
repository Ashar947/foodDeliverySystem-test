import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderStatusEnum } from '../order.entity';
import { Delivery } from './entities/delivery.entity';
import { ClientKafka } from '@nestjs/microservices';
import { SubOrder } from '../sub-orders/entities/sub-order.entity';
import { Op, fn, col, literal } from 'sequelize';

@Injectable()
export class DeliveryService {
  constructor(
    @Inject('notification-service')
    private readonly notificationService: ClientKafka,

    @Inject('restaurant-service')
    private readonly restaurantService: ClientKafka,
  ) {}
  async completeRide(id: number) {
    const delivery = await Delivery.findOne({
      where: { id },
    });
    if (!delivery) {
      throw new NotFoundException('Invalid Delivery .');
    }
    const currentTime = new Date();
    const deliveryCreatedTime = delivery.createdAt;
    const timeDifference =
      currentTime.getTime() - deliveryCreatedTime.getTime();
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    delivery.realDeliveryTime = formattedTime;

    // update order status and call notification service
    const order = await Order.findOne({
      where: { id: delivery.orderId },
    });
    order.status = OrderStatusEnum.DELIVERED;
    await order.save();
    this.notificationService.emit('update-order-status', {
      status: OrderStatusEnum.DELIVERED,
    });

    const subOrders = await SubOrder.findAll({
      where: {
        orderId: delivery.orderId,
      },
    });

    for (const subOrder of subOrders) {
      // update dish sales
      this.restaurantService.emit('update-dish-sales', {
        id: subOrder.dishId,
        quantity: subOrder.quantity,
      });
    }
    // update total orders for restaurant
    this.restaurantService.emit('update-restaurant-sales', {
      id: order.restaurantId,
    });
    await delivery.save();
    return { delivery };
  }

  async averageDeliveryTime(time: 'daily' | 'weekly') {
    const dateFormat = time === 'daily' ? '%Y-%m-%d' : '%Y-%u';
    const deliveries = await Delivery.findAll({
      attributes: [
        [fn('DATE_FORMAT', col('realDeliveryTime'), dateFormat), 'time'],
        [
          fn(
            'AVG',
            literal(
              'TIMESTAMPDIFF(MINUTE, `realDeliveryTime`, `realDeliveryTime`)',
            ),
          ),
          'averageDeliveryTime',
        ],
      ],
      where: {
        realDeliveryTime: {
          [Op.not]: null, // Ensures that only completed deliveries are counted
        },
      },
      group: ['time'],
      order: [[literal('time'), 'ASC']],
    });
    return { deliveries };
  }
}
