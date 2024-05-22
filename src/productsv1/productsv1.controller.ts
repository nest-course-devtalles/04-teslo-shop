import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { Productsv1Service } from './productsv1.service';
import { CreateProductsv1Dto } from './dto/create-productsv1.dto';
import { UpdateProductsv1Dto } from './dto/update-productsv1.dto';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';

@Controller('products')
export class Productsv1Controller {
  constructor(private readonly productsv1Service: Productsv1Service) {}

  @Post()
  create(@Body() createProductsv1Dto: CreateProductsv1Dto) {
    return this.productsv1Service.create(createProductsv1Dto);
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    return this.productsv1Service.findAll(paginationDTO);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsv1Service.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductsv1Dto: UpdateProductsv1Dto,
  ) {
    return this.productsv1Service.update(id, updateProductsv1Dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsv1Service.remove(id);
  }
}
