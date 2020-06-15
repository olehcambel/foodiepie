import { DeepPartial, getRepository } from 'typeorm';
import { Manager } from '../entities/manager.entity';
import { Seed } from '../lib/seed-run/runner';

export const seed: DeepPartial<Manager>[] = [
  {
    id: 1,
    firstName: 'fname_1',
    lastName: 'lname_1',
    email: 'manager@gmail.com',
    passwordHash: '6453fd457d2afa55624d55aabf85fe1f',
    passwordSalt: 'cVTjOpkUOa0ngw==',
    status: 'active',
  },
];

export default class ManagerSeed implements Seed {
  private repo = getRepository(Manager);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await this.repo.save(seed);
    return true;
  }
}
