import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productsv1Module } from './productsv1/productsv1.module';
import { CommonModule } from './common/common.module';

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
    Productsv1Module,
    CommonModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
