import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from './product.entity';

// TODO: currencyCode
// TODO: product, order - unique
@Entity('orderItems')
export class OrderItem implements AppEntity.OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 9, scale: 2 })
  price: string;

  @Column()
  quantity: number;

  /**
   * FIXME: if product is deleted, we should keep track of what it was
   * acctually should be invoiceItems and orderItems
   * @see http://www.databaseanswers.org/data_models/customers_and_invoices/index.htm
   */
  @ManyToOne(() => Product, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Order, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  order: Order;
}
