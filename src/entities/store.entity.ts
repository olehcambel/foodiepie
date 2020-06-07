import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreType } from './store-type.entity';

const statusArray: AppEntity.StoreStatus[] = [
  'pending',
  'active',
  'blocked',
  'deleted',
  'rejected',
];

@Entity('stores')
export class Store implements AppEntity.Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50 })
  slug: string;

  @Column({ length: 4096, nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  status: AppEntity.StoreStatus;

  @ManyToOne(() => StoreType, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  storeType: StoreType;
}
