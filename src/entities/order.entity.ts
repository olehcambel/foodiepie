import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Courier } from './courier.entity';
import { Currency } from './currency.entity';
import { Customer } from './customer.entity';
import { OrderAddress } from './order-address.entity';
import { OrderItem } from './order-item.entity';
import { StoreAddress } from './store-address.entity';

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

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ width: 1, default: false })
  isPaid: boolean;

  @Column('decimal', { precision: 9, scale: 2 })
  price: string;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  status: AppEntity.OrderStatus;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt: Date;

  @ManyToOne(() => Currency, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  currency: Currency;

  @ManyToOne(() => StoreAddress, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  storeAddress: StoreAddress;

  // TODO: should be nullable, as onDelete (set null) ?
  @ManyToOne(() => Customer, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  customer: Customer;

  @ManyToOne(() => Customer, {
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
