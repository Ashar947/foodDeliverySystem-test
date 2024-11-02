import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from '@app/common/entities/order.entity';
import { SubOrder } from '@app/common/entities/subOrder.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Catalog } from '@app/common/entities/catalog.entity';
import { User } from '@app/common/entities/user.entity';
import { UserTypesEnum } from '@app/common/constants/roleTypes.enum';
import { Op } from 'sequelize';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('catalog-service') private readonly catalogClient: ClientProxy,
  ) {}

  async create({ subOrders }: CreateOrderDto) {
    try {
      const order = await Order.create({
        totalOrderAmount: null,
        userId: 2,
      });
      let totalOrderAmount = 0.0;
      console.log({ subOrders });
      for (const { catalogId, quantity } of subOrders) {
        const catalog: Catalog | null = await firstValueFrom(
          this.catalogClient.send('get-catalog-id', { catalogId }),
        );
        console.log({ catalog });
        if (!catalog) {
          throw new BadRequestException('Invalid Catalog Selected.');
        }
        const totalAmount = catalog.amount * quantity;
        totalOrderAmount = totalOrderAmount + totalAmount;
        await SubOrder.create({
          catalogId,
          orderId: order.id,
          totalAmount,
          quantity,
        });
      }
      order.totalOrderAmount = totalOrderAmount;
      await order.save();
      await order.reload({
        include: [
          { association: 'subOrders', include: [{ association: 'catalog' }] },
          { association: 'user' },
        ],
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
    let orderData: Order[] = [];
    try {
      orderData = await Order.findAll({
        where: {
          userId: user.role === UserTypesEnum.ADMIN ? { [Op.ne]: null } : user.id,
        },
      });
    } catch {
      orderData = [];
    }
    return {
      success: true,
      message: 'Orders Fetched Successfully.',
      data: { orders: orderData },
    };
  }
}
