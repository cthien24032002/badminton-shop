import { CategoriesModule } from './../categories/categories.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './product.controller';
import { ImagesModule } from 'src/images/images.module';
import { ProductsService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),ImagesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductModule {}
