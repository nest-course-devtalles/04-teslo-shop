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
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/interfaces';
import { User } from 'src/auth/entities/user.entity';

@Controller('products')
export class Productsv1Controller {
  constructor(private readonly productsv1Service: Productsv1Service) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(
    @Body() createProductsv1Dto: CreateProductsv1Dto,
    @GetUser() user: User,
  ) {
    return this.productsv1Service.create(createProductsv1Dto, user);
  }

  @Get()
  findAll(@Query() paginationDTO: PaginationDTO) {
    console.log({ paginationDTO });
    return this.productsv1Service.findAll(paginationDTO);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsv1Service.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductsv1Dto: UpdateProductsv1Dto,
    @GetUser() user: User,
  ) {
    return this.productsv1Service.update(id, updateProductsv1Dto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsv1Service.remove(id);
  }
}
