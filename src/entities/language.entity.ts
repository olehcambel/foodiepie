import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('languages')
export class Language implements AppEntity.Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 8 })
  code: string;
}
