import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Language } from './language.entity';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export const statusArray: AppEntity.CourierStatus[] = [
  'pending',
  'deleted',
  'active',
  'blocked',
  'rejected',
];

@Entity('couriers')
export class Courier implements AppEntity.Courier {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  @ApiProperty({ enum: statusArray })
  status: AppEntity.CourierStatus;

  // TODO: phoneNumber (10) + phoneCode (3)
  @Column({ length: 20 })
  phoneNumber: string;

  @Column({ length: 50 })
  firstName: string;

  @Column({ length: 50 })
  lastName: string;

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
