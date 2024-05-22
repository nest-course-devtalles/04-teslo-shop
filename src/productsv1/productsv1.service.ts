import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductsv1Dto } from './dto/create-productsv1.dto';
import { UpdateProductsv1Dto } from './dto/update-productsv1.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductV1 } from './entities/productsv1.entity';
import { Repository } from 'typeorm';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';

@Injectable()
export class Productsv1Service {
  private readonly logger = new Logger('Productsv1Service');
  constructor(
    @InjectRepository(ProductV1)
    private readonly productRepository: Repository<ProductV1>,
  ) {}

  async create(createProductsv1Dto: CreateProductsv1Dto) {
    try {
      const product = this.productRepository.create(createProductsv1Dto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;
    return await this.productRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let product: ProductV1;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder
        .where(`UPPER(title)=:title or LOWER(slug)=:slug`, {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }
    return product;
  }

  async update(id: string, updateProductsv1Dto: UpdateProductsv1Dto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductsv1Dto,
    });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    // remove
    const productToRemove = await this.findOne(id);
    return this.productRepository.remove(productToRemove);

    // delete
    //  return this.productRepository.delete({ id });
  }

  private handleDbExceptions = (error: any) => {
    console.log(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('An error has ocurred , check logs');
  };
}
