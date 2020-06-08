import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { OrderCheckoutDto } from './dto/order.dto';
import { Order } from '../../entities/order.entity';
import { Product } from '../../entities/product.entity';
import { OrderItem } from '../../entities/order-item.entity';

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
      // count total price
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
       * However, it should not be RIGHT NOW, maybe 5 later???
       */

      scheduledDate: params.scheduledDate || new Date(),
      status: 'scheduled',
      price: String(totalPrice),
      // TODO: get currency from user ???
      currency: { id: 1 },
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
}
