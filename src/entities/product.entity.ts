import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductTranslation } from './product-translation.entity';
import { Store } from './store.entity';

export const statusArray: AppEntity.ProductStatus[] = ['active', 'deleted'];

@Entity('products')
export class Product implements AppEntity.Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  externalID: string;

  @Column({ length: 255, nullable: true })
  imageURL?: string;

  @Column('decimal', { precision: 9, scale: 2 })
  price: string;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  @ApiProperty({ enum: statusArray })
  status: AppEntity.ProductStatus;

  @ManyToOne(() => Store, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  store: Store;

  @OneToMany(() => ProductTranslation, (t) => t.product, {
    cascade: ['insert', 'update'],
  })
  translations: ProductTranslation[];

  // @ManyToOne(() => Currency, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  // currency: Currency;
}
