import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { StoreLocation } from './store-location.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export const statusArray: AppEntity.StoreStatus[] = [
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
  title: string;

  @Column({ length: 50 })
  slug: string;

  @Column({ length: 4096, nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  @ApiProperty({ enum: statusArray })
  status: AppEntity.StoreStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt: Date;

  @OneToOne(() => StoreLocation, (l) => l.store, {
    cascade: ['update', 'insert'],
  })
  location: StoreLocation;

  @ManyToOne(() => Customer, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  @ApiHideProperty()
  owner: Customer;
}
