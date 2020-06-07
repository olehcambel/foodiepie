import { getRepository, DeepPartial } from 'typeorm';
import { Seed } from 'src/lib/seed-run/runner';
import { StoreAddress } from 'src/entities/store-address.entity';
import StoreSeed from './store.seed';

export const seed: DeepPartial<StoreAddress>[] = [
  {
    id: 1,
    latitude: 25.482951,
    longitude: 9.036792,
    address: 'Obere Str. 1',
    postalCode: '12209',
    status: 'active',
    store: { id: 1 },
  },
  {
    id: 2,
    latitude: 29.482951,
    longitude: 9.036792,
    address: 'Konfederacka 4, 30-306 Kraków, Polska',
    postalCode: '12209',
    status: 'active',
    store: { id: 2 },
  },
  {
    id: 3,
    latitude: 28.482951,
    longitude: 9.036792,
    address: 'Konfederacka 5, 30-306 Kraków, Polska',
    postalCode: '12209',
    status: 'active',
    store: { id: 2 },
  },
  {
    id: 4,
    latitude: 27.482951,
    longitude: 9.036792,
    address: 'Konfederacka 6, 30-306 Kraków, Polska',
    postalCode: '12209',
    status: 'active',
    store: { id: 2 },
  },
  {
    id: 5,
    latitude: 26.482951,
    longitude: 9.036792,
    address: 'Konfederacka 7, 30-306 Kraków, Polska',
    postalCode: '12209',
    status: 'active',
    store: { id: 2 },
  },
];

export default class StoreAddressSeed implements Seed {
  private repo = getRepository(StoreAddress);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new StoreSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
