import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productsv1Module } from './productsv1/productsv1.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      autoLoadEntities: true,
      // entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    }),
    ProductsModule,
    Productsv1Module,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
