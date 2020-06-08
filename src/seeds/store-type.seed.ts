import { getRepository, DeepPartial } from 'typeorm';
import { StoreType } from '../entities/store-type.entity';
import { Seed } from '../lib/seed-run/runner';

export const seed: DeepPartial<StoreType>[] = [
  {
    id: 1,
    name: 'restaurant',
  },
  {
    id: 2,
    name: 'shop',
  },
  {
    id: 3,
    name: 'fastfood',
  },
];

export default class StoreTypeSeed implements Seed {
  private repo = getRepository(StoreType);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await this.repo.save(seed);
    return true;
  }
}
