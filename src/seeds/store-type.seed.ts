import { getRepository, DeepPartial } from 'typeorm';
import { Seed } from 'src/lib/seed-run/runner';
import { StoreType } from 'src/entities/store-type.entity';

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
