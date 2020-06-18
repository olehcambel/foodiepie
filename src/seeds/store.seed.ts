import { DeepPartial, getRepository } from 'typeorm';
import { Store } from '../entities/store.entity';
import { Seed } from '../lib/seed-run/runner';
import CustomerSeed from './customer.seed';

export const seed: DeepPartial<Store>[] = [
  {
    id: 1,
    title: 'NYX',
    slug: 'nyx',
    status: 'active',
    owner: { id: 1 },
  },
  {
    id: 2,
    title: 'Mafia',
    slug: 'mafia',
    status: 'active',
  },
];

export default class StoreSeed implements Seed {
  private repo = getRepository(Store);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new CustomerSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
