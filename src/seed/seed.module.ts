import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { Productsv1Module } from 'src/productsv1/productsv1.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [Productsv1Module, AuthModule],
})
export class SeedModule {}
