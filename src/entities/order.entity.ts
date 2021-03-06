import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ enum: statusArray })
  status: AppEntity.OrderStatus;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt?: Date;

  @Column({ default: false })
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

  @ManyToOne(() => StoreLocation, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  })
  storeLocation: StoreLocation;

  @ManyToOne(() => Customer, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  customer: Customer;

  @ManyToOne(() => Courier, {
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    nullable: true,
  })
  courier?: Courier;

  @Column({ name: 'courierId', nullable: true })
  courierID?: number;

  @OneToOne(() => OrderAddress, (oa) => oa.order, {
    cascade: ['update', 'insert'],
  })
  orderAddress: OrderAddress;

  @OneToMany(() => OrderItem, (oi) => oi.order, {
    cascade: ['update', 'insert'],
  })
  orderItems: OrderItem[];
}
