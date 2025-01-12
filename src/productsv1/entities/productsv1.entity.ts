import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'products' })
export class ProductV1 {
  @ApiProperty({
    example: '04852474-bd51-4eac-802e-a8c0158d9907',
    description: 'Product ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'T-shirt-teslo',
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: '0',
    description: 'Product price',
  })
  @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aliquam quia vero repudiandae, unde ullam quaerat, saepe voluptate asperiores quae alias itaque consequuntur odio ex non incidunt amet voluptatem odit? Doloribus!',
    description: 'Product description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: '3d_large_wordmark_pullover_hoodie',
    description: 'Produc SLUG - for SEO routes',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: '15',
    description: 'Number of products in stock',
    default: 0
  })
  @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product sizes',
  })
  @Column('text', {
    array: true,
  })
  sizes: string[];

  @ApiProperty({
    example: 'women',
    description: 'Product gender',
  })
  @Column('text')
  gender: string;

  @ApiProperty()
  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ApiProperty()
  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  @ManyToOne(() => User, (user) => user.products, {
    eager: true,
  })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
