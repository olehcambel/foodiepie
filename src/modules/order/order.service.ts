import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from 'src/entities/order-item.entity';
import { Order } from 'src/entities/order.entity';
import { Product } from 'src/entities/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { OrderCheckoutDto } from './dto/order.dto';

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
      scheduledDate: params.scheduledDate,
      status: 'scheduled',
      customer: { id: customerID },
      price: String(totalPrice),
      // TODO: get currency from user ???
      currency: { id: 1 },
      orderAddress: {
        address: params.orderAddress.address,
        latitude: params.orderAddress.latitude,
        longitude: params.orderAddress.longitude,
      },
      orderItems,
    });

    // await this.orderRepo.insert(order);

    return order;
  }
}
