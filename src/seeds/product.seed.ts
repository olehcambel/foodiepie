import { DeepPartial, getRepository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Seed } from '../lib/seed-run/runner';
import StoreAddressSeed from './store-location.seed';

export const seed: DeepPartial<Product>[] = [
  {
    id: 1,
    price: '10',
    status: 'active',
    store: { id: 1 },
    externalID: 'ext_1',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 2,
    price: '100',
    status: 'active',
    store: { id: 2 },
    externalID: 'ext_2',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 3,
    price: '200',
    status: 'active',
    store: { id: 4 },
    externalID: 'ext_3',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 4,
    price: '5',
    status: 'active',
    store: { id: 2 },
    externalID: 'ext_4',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 5,
    price: '2',
    status: 'active',
    store: { id: 2 },
    externalID: 'ext_5',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 6,
    price: '150',
    status: 'active',
    store: { id: 1 },
    externalID: 'ext_6',
    translations: [],
    // currency: { id: 2 },
  },
  {
    id: 7,
    price: '399',
    status: 'deleted',
    store: { id: 2 },
    externalID: 'ext_7',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 8,
    price: '24',
    status: 'active',
    store: { id: 4 },
    externalID: 'ext_8',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 9,
    price: '9.99',
    status: 'active',
    store: { id: 2 },
    externalID: 'ext_9',
    translations: [],
    // currency: { id: 1 },
  },
  {
    id: 10,
    price: '10',
    status: 'active',
    store: { id: 3 },
    externalID: 'ext_10',
    translations: [],
    // currency: { id: 1 },
  },
];

export default class ProductSeed implements Seed {
  private repo = getRepository(Product);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new StoreAddressSeed().up();
    // await new CurrencySeed().up();

    await this.repo.save(seed);
    return true;
  }
}
