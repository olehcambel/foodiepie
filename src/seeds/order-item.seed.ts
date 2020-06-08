import { DeepPartial, getRepository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';
import ProductSeed from './product.seed';
import OrderSeed from './order.seed';
import { Seed } from '../lib/seed-run/runner';

export const seed: DeepPartial<OrderItem>[] = [
  {
    price: '9.99',
    quantity: 2,
    product: { id: 1 },
    order: { id: 1 },
  },
  {
    price: '500',
    quantity: 2,
    product: { id: 2 },
    order: { id: 1 },
  },
  {
    price: '15',
    quantity: 2,
    product: { id: 3 },
    order: { id: 1 },
  },
  {
    price: '275',
    quantity: 2,
    product: { id: 4 },
    order: { id: 1 },
  },
  {
    price: '13',
    quantity: 2,
    product: { id: 8 },
    order: { id: 1 },
  },
  {
    price: '275',
    quantity: 2,
    product: { id: 4 },
    order: { id: 2 },
  },
];

export default class OrderItemSeed implements Seed {
  private repo = getRepository(OrderItem);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new OrderSeed().up();
    await new ProductSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
