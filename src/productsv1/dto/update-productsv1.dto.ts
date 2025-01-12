// import { PartialType } from '@nestjs/mapped-types';
import { PartialType } from '@nestjs/swagger';
import { CreateProductsv1Dto } from './create-productsv1.dto';

export class UpdateProductsv1Dto extends PartialType(CreateProductsv1Dto) {}
