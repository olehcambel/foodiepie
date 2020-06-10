import * as moment from 'moment-timezone';
import { DeepPartial, getRepository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Seed } from '../lib/seed-run/runner';
import CourierSeed from './courier.seed';
import CustomerSeed from './customer.seed';
import StoreAddressSeed from './store-location.seed';

export const seed: DeepPartial<Order>[] = [
  {
    id: 1,
    totalPrice: '150.0',
    deliveryPrice: '10',
    status: 'active',
    scheduledDate: new Date(),
    // currency: { id: 1 },
    storeLocation: { id: 1 },
    customer: { id: 1 },
    courier: { id: 1 },
  },
  {
    id: 2,
    totalPrice: '150.0',
    deliveryPrice: '10',
    status: 'delivered',
    scheduledDate: new Date(),
    finishedAt: moment().add('minute', 25).toDate(),
    // currency: { id: 1 },
    storeLocation: { id: 1 },
    customer: { id: 2 },
    courier: { id: 1 },
  },
  {
    id: 3,
    totalPrice: '500.50',
    deliveryPrice: '10',
    status: 'cancelled',
    scheduledDate: new Date(),
    // currency: { id: 1 },
    storeLocation: { id: 1 },
    customer: { id: 2 },
    courier: { id: 1 },
  },
  {
    id: 4,
    totalPrice: '10.0',
    deliveryPrice: '10',
    status: 'active',
    scheduledDate: moment().add('minute', 25).toDate(),
    // currency: { id: 1 },
    storeLocation: { id: 1 },
    customer: { id: 1 },
    courier: { id: 2 },
  },
  {
    id: 5,
    totalPrice: '100.0',
    deliveryPrice: '10',
    status: 'delivered',
    scheduledDate: moment().add('minute', -110).toDate(),
    finishedAt: moment().add('minute', -55).toDate(),
    // currency: { id: 1 },
    storeLocation: { id: 1 },
    customer: { id: 2 },
    courier: { id: 1 },
  },
];

export default class OrderSeed implements Seed {
  private repo = getRepository(Order);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    // await new CurrencySeed().up();
    await new StoreAddressSeed().up();
    await new CustomerSeed().up();
    await new CourierSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
