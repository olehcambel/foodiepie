import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreAddress } from './store-address.entity';
import { Currency } from './currency.entity';

export const statusArray: AppEntity.ProductStatus[] = ['active', 'deleted'];

@Entity('products')
export class Product implements AppEntity.Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, nullable: true })
  externalID?: string;

  @Column({ length: 256, nullable: true })
  imageURL?: string;

  @Column('decimal', { precision: 9, scale: 2 })
  price: string;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  status: AppEntity.ProductStatus;

  @ManyToOne(() => StoreAddress, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  storeAddress: StoreAddress;

  @ManyToOne(() => Currency, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  currency: Currency;
}
