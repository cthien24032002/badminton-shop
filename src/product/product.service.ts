import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product)private productRepo: Repository<Product>,) {}
  
  async create(dto :CreateProductDto): Promise<CreateProductDto> {
    const Product = this.productRepo.create(dto);
    return await this.productRepo.save(Product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepo.find({relations: ['orderItems']});
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({where:{id},relations: ['orderItems']});
    if(!product){
      throw new Error(`Product with ID ${id} not found`);
    }
    return product;  ;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const prudct  = await this.findOne(id);
    await this.productRepo.remove(prudct);
  }
}
