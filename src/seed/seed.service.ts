import { Injectable } from '@nestjs/common';
import { Productsv1Service } from 'src/productsv1/productsv1.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsv1Service: Productsv1Service) {}
  async runSeed() {
    this.insertNewProducts();
    return null;
  }
  private async insertNewProducts() {
    this.productsv1Service.deleteAllProducts();
    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsv1Service.create(product));
    });
    await Promise.all(insertPromises);
  }
}
