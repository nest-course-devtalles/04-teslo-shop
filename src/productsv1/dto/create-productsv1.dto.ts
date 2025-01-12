import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateProductsv1Dto {
  @ApiProperty({
    description: 'The title of the product',
    example: 'Nike Air Max 90',
    nullable: false,
    minLength: 1,
    uniqueItems: true,
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 200,
    nullable: true,
    default: 0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'The description of the product',
    example: 'The best sneakers in the market',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'The slug of the product for SEO routes',
    example: 'nike_air_max_90',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'Number of products in stock',
    example: 15,
    nullable: true,
    default: 0,
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Product sizes',
    example: ['M', 'XL', 'XXL'],
    nullable: true,
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Product tags',
    example: ['sneakers', 'nike', 'airmax'],
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];

  @ApiProperty({
    description: 'Product images',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    nullable: false,
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  @IsNotEmpty()
  images: string[];

  @ApiProperty({
    description:
      'Product gender must be one of values: men, women, kig, unisex"',
    example: 'men',
    nullable: false,
  })
  @IsIn(['men', 'women', 'kig', 'unisex'])
  gender: string;
}
