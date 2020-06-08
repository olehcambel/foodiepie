import { getRepository, DeepPartial } from 'typeorm';
import { Language } from '../entities/language.entity';
import { Seed } from '../lib/seed-run/runner';

export const seed: DeepPartial<Language>[] = [
  {
    id: 1,
    code: 'en',
  },
  {
    id: 2,
    code: 'ru',
  },
  {
    id: 3,
    code: 'fr',
  },
];

export default class LanguageSeed implements Seed {
  private repo = getRepository(Language);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await this.repo.save(seed);
    return true;
  }
}
