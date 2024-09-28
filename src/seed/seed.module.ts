import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Productsv1Module } from 'src/productsv1/productsv1.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [Productsv1Module],
})
export class SeedModule {}
