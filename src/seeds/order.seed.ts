import { Seed } from 'src/lib/seed-run/runner';
import { DeepPartial, getRepository } from 'typeorm';
import { Order } from '../entities/order.entity';
import CourierSeed from './courier.seed';
import CurrencySeed from './currency.seed';
import CustomerSeed from './customer.seed';
import OrderAddressSeed from './order-address.seed';
import StoreAddressSeed from './store-address.seed';

export const seed: DeepPartial<Order>[] = [
  {
    id: 1,
    price: '150.0',
    status: 'active',
    currency: { id: 1 },
    storeAddress: { id: 1 },
    customer: { id: 1 },
    courier: { id: 1 },
  },
  {
    id: 2,
    price: '150.0',
    status: 'active',
    currency: { id: 1 },
    storeAddress: { id: 1 },
    customer: { id: 2 },
    courier: { id: 1 },
  },
];

export default class OrderSeed implements Seed {
  private repo = getRepository(Order);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new CurrencySeed().up();
    await new StoreAddressSeed().up();
    await new CustomerSeed().up();
    await new CourierSeed().up();
    await new OrderAddressSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
