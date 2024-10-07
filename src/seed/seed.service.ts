import { Injectable } from '@nestjs/common';
import { Productsv1Service } from 'src/productsv1/productsv1.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsv1Service: Productsv1Service,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    this.insertNewProducts(adminUser);
    return null;
  }

  private async deleteTables() {
    await this.productsv1Service.deleteAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async insertNewProducts(user: User) {
    // this.productsv1Service.deleteAllProducts();
    const products = initialData.products;

    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productsv1Service.create(product, user));
    });
    await Promise.all(insertPromises);
  }

  private async insertUsers() {
    // this.productsv1Service.deleteAllProducts();
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach((user) => {
      users.push(
        this.userRepository.create({
          ...user,
          password: bcrypt.hashSync(user.password, 10),
        }),
      );
    });
    const usersCreated = await this.userRepository.save(users);
    return usersCreated[0];
  }
}
