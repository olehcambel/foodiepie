import { DeepPartial, getRepository } from 'typeorm';
import { ProductTranslation } from '../entities/product-translation.entity';
import ProductSeed from './product.seed';
import { Seed } from '../lib/seed-run/runner';
import LanguageSeed from './language.seed';

export const seed: DeepPartial<ProductTranslation>[] = [
  {
    title: 'title_1',
    description: 'title_1',
    product: { id: 1 },
    language: { id: 1 },
  },
  {
    title: 'title_2',
    description: 'title_2',
    product: { id: 2 },
    language: { id: 1 },
  },
  {
    title: 'title_3',
    description: 'title_3',
    product: { id: 3 },
    language: { id: 1 },
  },
  {
    title: 'title_4',
    description: 'title_4',
    product: { id: 4 },
    language: { id: 1 },
  },
  {
    title: 'title_5',
    description: 'title_5',
    product: { id: 5 },
    language: { id: 1 },
  },
  {
    title: 'title_6',
    description: 'title_6',
    product: { id: 6 },
    language: { id: 1 },
  },
  {
    title: 'title_7',
    description: 'title_7',
    product: { id: 7 },
    language: { id: 1 },
  },
  {
    title: 'title_8',
    description: 'title_8',
    product: { id: 8 },
    language: { id: 1 },
  },
  {
    title: 'title_9',
    description: 'title_9',
    product: { id: 9 },
    language: { id: 1 },
  },
  {
    title: 'title_10',
    description: 'title_10',
    product: { id: 10 },
    language: { id: 1 },
  },
];

export default class ProductTranslationSeed implements Seed {
  private repo = getRepository(ProductTranslation);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new LanguageSeed().up();
    await new ProductSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
