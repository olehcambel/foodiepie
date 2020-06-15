import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OrderCheckoutDto, GetCustomerOrders } from './dto/order.dto';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { PAGE_LIMIT, PAGE_OFFSET } from '../../common/constants';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async checkout(customerID: number, params: OrderCheckoutDto): Promise<Order> {
    const productIds = params.products.map((p) => p.id);
    const products = await this.productRepo.findByIds(productIds);
    let totalPrice = 0;
    const orderItems: DeepPartial<OrderItem>[] = [];

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      totalPrice += Number(p.price);

      orderItems.push({
        product: { id: p.id },
        price: p.price,
        // FIXME: check if the order is right
        quantity: params.products[i].quantity,
      });
    }

    const order = await this.orderRepo.save({
      description: params.description,
      /** FIXME:
       * If you want the order to be scheduled, provide a scheduleTime.
       * Otherwise, it'll be scheduled for immediate delivery.
       * However, it should not be RIGHT NOW, maybe 25 later???
       */

      scheduledDate: params.scheduledDate || new Date(),
      status: 'scheduled',
      totalPrice: String(totalPrice),
      // TODO: how to calculate delivery price (location)?
      // deliveryPrice: 40,
      customer: { id: customerID },
      orderAddress: {
        address: params.orderAddress.address,
        latitude: params.orderAddress.latitude,
        longitude: params.orderAddress.longitude,
      },
      orderItems,
    });

    return order;
  }

  async cancelOrder(customerID: number, orderID: number): Promise<boolean> {
    const o = await this.orderRepo.findOne({
      select: ['id', 'status'],
      where: { id: orderID, customer: { id: customerID } },
    });
    if (!o) {
      throw new BadRequestException('failed to find order');
    }

    if (o.status === 'scheduled') {
      o.status = 'cancelled';
      o.finishedAt = new Date();
      await this.orderRepo.save(o);

      return true;
    }

    throw new BadRequestException('status must be "scheduled" to cancel');
  }

  getOrders(userID: number, params: GetCustomerOrders): Promise<Order[]> {
    return this.orderRepo.find({
      take: params.limit || PAGE_LIMIT,
      skip: params.offset || PAGE_OFFSET,
      select: ['id', 'isPaid', 'totalPrice', 'status'],
      where: {
        customer: {
          id: userID,
        },
      },
    });
  }
}
