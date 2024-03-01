import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductV1 {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;
}
