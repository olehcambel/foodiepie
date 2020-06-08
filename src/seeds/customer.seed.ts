import { DeepPartial, getRepository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import LanguageSeed from './language.seed';
import { Seed } from '../lib/seed-run/runner';

export const seed: DeepPartial<Customer>[] = [
  {
    id: 1,
    name: 'customer_1',
    email: 'customer_1@gmail.com',
    passwordHash: '6453fd457d2afa55624d55aabf85fe1f',
    passwordSalt: 'cVTjOpkUOa0ngw==',
    status: 'active',
    language: { id: 1 },
  },
  {
    id: 2,
    name: 'customer_2',
    email: 'customer_2@gmail.com',
    passwordHash: '949374e75e964b70e407109369f3bde8',
    passwordSalt: '+BeYNl0za6TXmA==',
    status: 'active',
    language: { id: 1 },
  },
];

export default class CustomerSeed implements Seed {
  private repo = getRepository(Customer);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new LanguageSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
