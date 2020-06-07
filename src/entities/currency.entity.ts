import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('currencies')
export class Currency implements AppEntity.Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 3 })
  code: string;
}
