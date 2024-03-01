import { Module } from '@nestjs/common';
import { Productsv1Service } from './productsv1.service';
import { Productsv1Controller } from './productsv1.controller';
import { ProductV1 } from './entities/productsv1.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [Productsv1Controller],
  providers: [Productsv1Service],
  imports: [TypeOrmModule.forFeature([ProductV1])],
})
export class Productsv1Module {}
