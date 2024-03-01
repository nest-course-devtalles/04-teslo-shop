import { Injectable } from '@nestjs/common';
import { CreateProductsv1Dto } from './dto/create-productsv1.dto';
import { UpdateProductsv1Dto } from './dto/update-productsv1.dto';

@Injectable()
export class Productsv1Service {
  create(createProductsv1Dto: CreateProductsv1Dto) {
    return 'This action adds a new productsv1';
  }

  findAll() {
    return `This action returns all productsv1`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productsv1`;
  }

  update(id: number, updateProductsv1Dto: UpdateProductsv1Dto) {
    return `This action updates a #${id} productsv1`;
  }

  remove(id: number) {
    return `This action removes a #${id} productsv1`;
  }
}
