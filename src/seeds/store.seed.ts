import { DeepPartial, getRepository } from 'typeorm';
import { Store } from '../entities/store.entity';
import StoreTypeSeed from './store-type.seed';
import { Seed } from '../lib/seed-run/runner';

export const seed: DeepPartial<Store>[] = [
  {
    id: 1,
    name: 'NYX',
    slug: 'nyx',
    status: 'active',
    storeType: { id: 2 },
  },
  {
    id: 2,
    name: 'Mafia',
    slug: 'mafia',
    status: 'active',
    storeType: { id: 2 },
  },
];

export default class StoreSeed implements Seed {
  private repo = getRepository(Store);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new StoreTypeSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
