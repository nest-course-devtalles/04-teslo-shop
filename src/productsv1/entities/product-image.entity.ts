import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductV1 } from './productsv1.entity';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(() => ProductV1, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  product: ProductV1;
}
