import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment-timezone';
import { DeepPartial, Repository } from 'typeorm';
import { PAGE_LIMIT, PAGE_OFFSET } from '../../common/constants';
import { OrderItem } from '../../entities/order-item.entity';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { GetCustomerOrders, OrderCheckoutDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Math.max(100, totalPrice)
   * if getTotal() < 100 { additional tax }
   * Order
   * - lineItems
   * - shipping
   * + getTotal()
   * + getShippingCost()
   * + getShippingDate()
   */

  // FIXME: O(3N)
  async checkout(customerID: number, params: OrderCheckoutDto): Promise<Order> {
    let totalPrice = 0;
    const orderItems: DeepPartial<OrderItem>[] = [];
    const pQueryIDs = params.products.map((p) => p.id);
    const products = await this.productRepo.findByIds(pQueryIDs, {
      select: ['id', 'price'],
    });

    for (const productQuery of params.products) {
      const product = products.find((p) => p.id === productQuery.id);
      if (!product) {
        throw new BadRequestException('products is not available');
      }
      totalPrice += Number(product.price);
      orderItems.push({
        product: { id: product.id },
        price: product.price,
        quantity: productQuery.quantity,
      });
    }

    const order = await this.orderRepo.save({
      description: params.description,
      /**
       * If you want the order to be scheduled, provide a scheduleTime.
       * Otherwise, it'll be scheduled for immediate delivery.
       * FIXME: However, it should not be RIGHT NOW, maybe 25 later???
       */
      scheduledDate:
        params.scheduledDate || moment().add(25, 'minutes').toDate(),
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
      storeLocation: params.storeLocation,
    });

    return order;
  }

  async cancel(customerID: number, orderID: number): Promise<boolean> {
    const o = await this.orderRepo.findOneOrFail({
      select: ['id', 'status'],
      where: { id: orderID, customer: { id: customerID } },
    });

    if (o.status === 'scheduled') {
      o.status = 'cancelled';
      o.finishedAt = new Date();
      await this.orderRepo.save(o);

      return true;
    }

    throw new BadRequestException('status must be "scheduled" to cancel');
  }

  find(userID: number, params: GetCustomerOrders = {}): Promise<Order[]> {
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
