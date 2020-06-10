import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Courier } from './courier.entity';
import { Customer } from './customer.entity';
import { OrderAddress } from './order-address.entity';
import { OrderItem } from './order-item.entity';
import { StoreLocation } from './store-location.entity';

export const statusArray: AppEntity.OrderStatus[] = [
  'scheduled',
  'active',
  'delivered',
  'cancelled',
];

@Entity('orders')
export class Order implements AppEntity.Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  status: AppEntity.OrderStatus;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt?: Date;

  @Column({ width: 1, default: false })
  isPaid: boolean;

  @Column('decimal', { precision: 9, scale: 2 })
  totalPrice: string;

  @Column('decimal', { precision: 9, scale: 2, default: '0' })
  deliveryPrice: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt: Date;

  @ManyToOne(() => StoreLocation, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  storeLocation: StoreLocation;

  @ManyToOne(() => Customer, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  customer: Customer;

  @ManyToOne(() => Courier, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true,
  })
  courier?: Courier;

  @OneToOne(() => OrderAddress, (oa) => oa.address, {
    cascade: ['update', 'insert'],
  })
  orderAddress: OrderAddress;

  @OneToMany(() => OrderItem, (oi) => oi.order, {
    cascade: ['update', 'insert'],
  })
  orderItems: OrderItem[];
}
