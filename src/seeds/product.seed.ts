import { Seed } from 'src/lib/seed-run/runner';
import { DeepPartial, getRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import CurrencySeed from './currency.seed';
import StoreAddressSeed from './store-address.seed';

export const seed: DeepPartial<Product>[] = [
  {
    id: 1,
    price: '10',
    status: 'active',
    storeAddress: { id: 1 },
    currency: { id: 1 },
  },
  {
    id: 2,
    price: '100',
    status: 'active',
    storeAddress: { id: 2 },
    currency: { id: 1 },
  },
  {
    id: 3,
    price: '200',
    status: 'active',
    storeAddress: { id: 4 },
    currency: { id: 1 },
  },
  {
    id: 4,
    price: '5',
    status: 'active',
    storeAddress: { id: 2 },
    currency: { id: 1 },
  },
  {
    id: 5,
    price: '2',
    status: 'active',
    storeAddress: { id: 2 },
    currency: { id: 1 },
  },
  {
    id: 6,
    price: '150',
    status: 'active',
    storeAddress: { id: 1 },
    currency: { id: 2 },
  },
  {
    id: 7,
    price: '399',
    status: 'deleted',
    storeAddress: { id: 2 },
    currency: { id: 1 },
  },
  {
    id: 8,
    price: '24',
    status: 'active',
    storeAddress: { id: 4 },
    currency: { id: 1 },
  },
  {
    id: 9,
    price: '9.99',
    status: 'active',
    storeAddress: { id: 2 },
    currency: { id: 1 },
  },
  {
    id: 10,
    price: '10',
    status: 'active',
    storeAddress: { id: 3 },
    currency: { id: 1 },
  },
];

export default class ProductSeed implements Seed {
  private repo = getRepository(Product);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new StoreAddressSeed().up();
    await new CurrencySeed().up();

    await this.repo.save(seed);
    return true;
  }
}
