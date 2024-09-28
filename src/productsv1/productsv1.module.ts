import { Module } from '@nestjs/common';
import { Productsv1Service } from './productsv1.service';
import { Productsv1Controller } from './productsv1.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductV1, ProductImage } from './entities';

@Module({
  controllers: [Productsv1Controller],
  providers: [Productsv1Service],
  imports: [TypeOrmModule.forFeature([ProductV1, ProductImage])],
  exports: [Productsv1Service, TypeOrmModule],
})
export class Productsv1Module {}
