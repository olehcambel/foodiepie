import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from './product.entity';

@Entity('productTranslations')
export class ProductTranslation implements AppEntity.ProductTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column('tinytext', { nullable: true })
  description?: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  product: Product;
}
