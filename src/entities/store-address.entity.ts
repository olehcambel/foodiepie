import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Store } from './store.entity';

const statusArray: AppEntity.StoreAddressStatus[] = ['active', 'deleted'];

@Entity('storeAddresss')
export class StoreAddress implements AppEntity.StoreAddress {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({type: 'point'})
  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 10 })
  postalCode: string;

  @Column('decimal', { precision: 2, scale: 1, nullable: true })
  rating?: number;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  status: AppEntity.StoreAddressStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt: Date;

  @ManyToOne(() => Store, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  store: Store;
}
