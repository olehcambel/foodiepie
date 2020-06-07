import { getRepository, DeepPartial } from 'typeorm';
import { Courier } from '../entities/courier.entity';
import LanguageSeed from './language.seed';
import { Seed } from 'src/lib/seed-run/runner';

export const seed: DeepPartial<Courier>[] = [
  {
    id: 1,
    firstName: 'first_1',
    lastName: 'last_1',
    email: 'customer_1@gmail.com',
    phoneNumber: '+380730281773',
    passwordHash: '6453fd457d2afa55624d55aabf85fe1f',
    passwordSalt: 'cVTjOpkUOa0ngw==',
    status: 'active',
    language: { id: 1 },
  },
  {
    id: 2,
    firstName: 'first_2',
    lastName: 'last_2',
    email: 'customer_2@gmail.com',
    phoneNumber: '+380730281773',
    passwordHash: '949374e75e964b70e407109369f3bde8',
    passwordSalt: '+BeYNl0za6TXmA==',
    status: 'pending',
    language: { id: 1 },
  },
];

export default class CourierSeed implements Seed {
  private repo = getRepository(Courier);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new LanguageSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
