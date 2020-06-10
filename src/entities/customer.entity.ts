import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from './language.entity';

export const statusArray: AppEntity.CustomerStatus[] = [
  'active',
  'blocked',
  'deleted',
];

@Entity('customers')
export class Customer implements AppEntity.Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  name: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 50, select: false })
  @ApiHideProperty()
  passwordHash: string;

  @Column({ length: 50, select: false })
  @ApiHideProperty()
  passwordSalt: string;

  @Column({ length: 255, nullable: true })
  imageURL?: string;

  @Column({ length: 255, nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  status: AppEntity.CustomerStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt: Date;

  @ManyToOne(() => Language, { onUpdate: 'CASCADE', onDelete: 'SET NULL' })
  language: Language;
}
