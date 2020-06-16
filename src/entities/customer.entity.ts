import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Language } from './language.entity';

// TODO: export abstract class BaseUserEntity {}

export const statusArray: AppEntity.CustomerStatus[] = [
  'active',
  'blocked',
  'deleted',
];

// export enum CustomerStatus {
//   Active = 'active',
//   Blocked = 'blocked',
//   Deleted = 'deleted',
// }

@Entity('customers')
export class Customer implements AppEntity.Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  @ApiProperty({ enum: statusArray })
  status: AppEntity.CustomerStatus;

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
