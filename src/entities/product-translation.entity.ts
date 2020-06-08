import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Product } from './product.entity';
import { Language } from './language.entity';

@Entity('productTranslations')
export class ProductTranslation implements AppEntity.ProductTranslation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  product: Product;

  @ManyToOne(() => Language, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  language: Language;
}
