import { DeepPartial, getRepository } from 'typeorm';
import { OrderAddress } from '../entities/order-address.entity';
import { Seed } from '../lib/seed-run/runner';
import LanguageSeed from './language.seed';
import OrderSeed from './order.seed';

export const seed: DeepPartial<OrderAddress>[] = [
  {
    latitude: 40.4609696,
    longitude: 30.3571244,
    address: 'Galeria Krakowska, Pawia 5, 31-154 Kraków, Poland',
    instructions: 'turn right before orange door',
    details: 'Blue button of the intercom',
    contactPerson: 'Dave',
    contactPhone: '+34622334452',
    order: { id: 1 },
  },
  {
    latitude: 40.4609696,
    longitude: 30.3571244,
    address: 'Józefitów 2, 30-039 Kraków, Poland',
    details: '2nd Floor',
    contactPerson: 'Marco',
    contactPhone: '+34622334452',
    order: { id: 2 },
  },
  {
    latitude: 20.4609696,
    longitude: 50.3571244,
    address: 'Świętej Anny 3, 31-008 Kraków, Poland',
    instructions: 'turn right before orange door',
    details: 'Blue button of the intercom',
    contactPerson: 'Dave',
    contactPhone: '+34622334452',
    order: { id: 3 },
  },
  {
    latitude: 15.4609696,
    longitude: 16.3571244,
    address: 'Aleja Pokoju 22, 31-563 Kraków, Polska',
    instructions: 'turn right before orange door',
    details: 'Blue button of the intercom',
    contactPerson: 'Dave',
    contactPhone: '+34622334452',
    order: { id: 4 },
  },
  {
    latitude: 20.4609696,
    longitude: 50.3571244,
    address: 'Świętej Anny 3, 31-008 Kraków, Poland',
    instructions: 'turn right before orange door',
    details: 'Blue button of the intercom',
    contactPerson: 'Dave',
    contactPhone: '+34622334452',
    order: { id: 5 },
  },
];

export default class OrderAddressSeed implements Seed {
  private repo = getRepository(OrderAddress);

  async up(): Promise<boolean> {
    const exist = await this.repo.findOne();
    if (exist) return false;

    await new LanguageSeed().up();
    await new OrderSeed().up();

    await this.repo.save(seed);
    return true;
  }
}
