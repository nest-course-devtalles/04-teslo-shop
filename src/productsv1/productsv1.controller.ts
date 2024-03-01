import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Productsv1Service } from './productsv1.service';
import { CreateProductsv1Dto } from './dto/create-productsv1.dto';
import { UpdateProductsv1Dto } from './dto/update-productsv1.dto';

@Controller('productsv1')
export class Productsv1Controller {
  constructor(private readonly productsv1Service: Productsv1Service) {}

  @Post()
  create(@Body() createProductsv1Dto: CreateProductsv1Dto) {
   console.log(createProductsv1Dto);
    return this.productsv1Service.create(createProductsv1Dto);
  }

  @Get()
  findAll() {
    return this.productsv1Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsv1Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsv1Dto: UpdateProductsv1Dto) {
    return this.productsv1Service.update(+id, updateProductsv1Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsv1Service.remove(+id);
  }
}
