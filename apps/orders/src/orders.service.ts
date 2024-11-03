import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { User } from '@app/common/entities/user.entity';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { Op } from 'sequelize';
import { Order } from './order.entity';
import { SubOrder } from './sub-orders/entities/sub-order.entity';
import { Delivery } from './delivery/entities/delivery.entity';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from './dto/event/create-order.event';
import { ValidateDish } from './dto/event/validate-dish.event';
import { ValidateRestaurantEvent } from './dto/event/validate-restaurant.event';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @Inject('notification-service')
    private readonly notificationService: ClientKafka,

    @Inject('restaurant-service')
    private readonly restaurantService: ClientKafka,

    @Inject('auth-service')
    private readonly authService: ClientKafka,
  ) {}
  async onModuleInit() {
    this.restaurantService.subscribeToResponseOf('validate-dish');
    this.restaurantService.subscribeToResponseOf('validate-restaurant');
    this.authService.subscribeToResponseOf('authenticate');
    this.authService.subscribeToResponseOf('authenticate.reply');
    await this.authService.connect();
    console.log('Connected to Auth');
    await this.restaurantService.connect();
  }

  async create(
    {
      subOrders,
      orderNotes = null,
      restaurantId,
      deliveryAddress,
    }: CreateOrderDto,
    user: User,
  ) {
    try {
      // TODO : validate restaurantId
      const restaurantCheck = await this.restaurantService
        .send('validate-restaurant', new ValidateRestaurantEvent(restaurantId))
        .toPromise();
      if (!restaurantCheck) {
        throw new BadRequestException('Invalid Restaurant.');
      }
      const order = await Order.create({
        orderNotes,
        userId: user.id,
        restaurantId,
      });
      let totalOrderAmount = 0.0;
      const orderId = order.id;
      for (const subOrder of subOrders) {
        const dishValidation = await this.restaurantService
          .send('validate-dish', new ValidateDish(subOrder.dishId))
          .toPromise();
        if (!dishValidation) {
          throw new BadRequestException('Invalid Dish.');
        }
        const totalPrice = subOrder.quantity * 10;
        await SubOrder.create({
          orderId,
          dishId: subOrder.dishId,
          quantity: subOrder.quantity,
          totalPrice,
        });
        totalOrderAmount += totalPrice;
      }
      await Delivery.create({
        orderId,
        customerId: user.id,
        riderId: 2,
        deliveryAddress,
      });
      // create notification event
      order.totalOrderAmount = totalOrderAmount;
      await order.save();
      await order.reload({
        include: [{ association: 'subOrders' }],
      });
      this.notificationService.emit(
        'order-creation',
        new OrderCreatedEvent(
          order.id,
          user.id,
          user.name,
          order.status,
          'Restaurant Name',
          totalOrderAmount,
        ),
      );
      this.notificationService.emit('update-order-status', {
        status: order.status,
      });
      return {
        success: true,
        message: 'Order Created Successfully.',
        data: { order },
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(user: User) {
    const orders = await Order.findAll({
      where: {
        userId:
          user.userType === UserTypesEnum.ADMIN ? { [Op.ne]: null } : user.id,
      },
    });
    return {
      success: true,
      message: 'Orders Fetched Successfully.',
      data: { orders },
    };
  }
}
