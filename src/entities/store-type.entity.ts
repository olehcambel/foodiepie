import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('storeTypes')
export class StoreType implements AppEntity.StoreType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  name: string;
}
