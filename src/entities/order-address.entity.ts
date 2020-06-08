import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('orderAddresses')
export class OrderAddress implements AppEntity.OrderAddress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 8 })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8 })
  longitude: number;

  @Column({ length: 100 })
  address: string;

  @Column({ length: 100, nullable: true })
  instructions?: string;

  @Column({ length: 100, nullable: true })
  details?: string;

  @Column({ length: 50, nullable: true })
  contactPerson?: string;

  @Column({ length: 20, nullable: true })
  contactPhone?: string;

  @OneToOne(() => Order, (o) => o.orderAddress, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  order: Order;
}
