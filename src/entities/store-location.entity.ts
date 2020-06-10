import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Store } from './store.entity';

@Entity('storeLocations')
export class StoreLocation implements AppEntity.StoreLocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 10 })
  postalCode: string;

  @OneToOne(() => Store, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn()
  store: Store;
}
