import { ApiHideProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export const statusArray: AppEntity.EmployeeStatus[] = ['active', 'deleted'];

@Entity('managers')
export class Manager implements AppEntity.Manager {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: statusArray, default: statusArray[0] })
  status: AppEntity.EmployeeStatus;

  @Column({ length: 50 })
  firstName?: string;

  @Column({ length: 50 })
  lastName?: string;

  @Column({ length: 50, unique: true })
  email: string;

  @Column({ length: 50, select: false })
  @ApiHideProperty()
  passwordHash: string;

  @Column({ length: 50, select: false })
  @ApiHideProperty()
  passwordSalt: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  readonly createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  readonly updatedAt: Date;
}
