import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { slugify } from 'src/common/utils/slug.util';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const Product = this.productRepo.create(dto);
    return await this.productRepo.save({
      ...Product,
      category: { id: dto.categoryId },
    });
  }

  async findAll(query: PaginationDto & { search?: string } ) {
    const { page = 1, pageSize = 10, search } = query;

    const [products, total] = await this.productRepo.findAndCount({
      where: search ? { slug: Like(`%${slugify(search)}%`) } : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
      withDeleted: false,
    });

    const pagination = buildPaginationMeta(
      total,
      products.length,
      page,
      pageSize,
    );

    return { dataResult:products, pagination };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['orderItems'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    const productMerge = this.productRepo.merge(product, updateProductDto);
    return await this.productRepo.save(productMerge);
  }

  async remove(id: number): Promise<void> {
    // !: chưa xác thực thì không nên code delete
    // const prudct  = await this.findOne(id);
    // await this.productRepo.remove(prudct);
  }
}
