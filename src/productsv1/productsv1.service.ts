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
import { DataSource, Repository } from 'typeorm';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class Productsv1Service {
  private readonly logger = new Logger('Productsv1Service');
  constructor(
    @InjectRepository(ProductV1)
    private readonly productRepository: Repository<ProductV1>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductsv1Dto: CreateProductsv1Dto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductsv1Dto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user,
      });
      await this.productRepository.save(product);
      return {
        ...product,
        images: images,
      };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDTO: PaginationDTO) {
    const { limit = 10, offset = 0 } = paginationDTO;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    });
    return products.map((product) => ({
      ...product,
      images: product.images.map((img) => img.url),
    }));
  }

  async findOne(term: string) {
    let product: ProductV1;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where(`UPPER(title)=:title or LOWER(slug)=:slug`, {
          title: term.toUpperCase(),
          slug: term.toLocaleLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with ${term} not found`);
    }
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map((image) => image.url),
    };
  }

  async update(id: string, updateProductsv1Dto: UpdateProductsv1Dto, user: User) {
    const { images, ...productToUpdate } = updateProductsv1Dto;

    const product = await this.productRepository.preload({
      id,
      ...productToUpdate,
    });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    // create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: id });
        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      }

      product.user= user
      await queryRunner.manager.save(product);
      // await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }
}
