import { Seed } from 'src/lib/seed-run/runner';
import { DeepPartial, getRepository } from 'typeorm';
import { Currency } from '../entities/currency.entity';

export const seed: DeepPartial<Currency>[] = [
  {
    id: 1,
    code: 'USD',
  },
  {
    id: 2,
    code: 'EUR',
  },
  {
    id: 3,
    code: 'RUB',
  },
  {
    id: 4,
    code: 'SGD',
  },
  {
    id: 5,
    code: 'SOS',
  },
];

export default class CurrencySeed implements Seed {
  private repo = getRepository(Currency);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await this.repo.save(seed);
    return true;
  }
}
