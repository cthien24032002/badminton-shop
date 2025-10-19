import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Like, MoreThanOrEqual, Repository } from 'typeorm';
import { ProductDto } from './dto/product.dto';
import { plainToInstance } from 'class-transformer';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import { slugify } from 'src/common/utils/slug.util';
import { ImagesService } from 'src/images/images.service';
import { QueryAllProductDto } from './dto/query-all-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productImageService: ImagesService,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAllAdmin(query: QueryAllProductDto) {
    const { page = 1, pageSize = 10, search, categoryId } = query;

    const where: any = {};

    if (search) where.slug = Like(`%${slugify(search)}%`);

    if (categoryId) where.category = { id: categoryId };

    const [products, total] = await this.productRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      withDeleted: true,
    });

    const dataResult = plainToInstance(ProductDto, products, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const pagination = buildPaginationMeta(
      total,
      products.length,
      page,
      pageSize,
    );

    return { dataResult, pagination };
  }

  async updateStock(id: number, qty: number) {
    const product = await this.findOne(id);
    if (qty > product.stock)
      throw new BadRequestException(
        `Sản phẩm ${product.name} không đủ số lượng đơn hàng`,
      );
    const stock = product.stock - qty;
    return this.productRepo.save({ id: product.id, stock: stock });
  }

  //  SITE USER

  // ProductService
  async create(listUrl: string[], dto: CreateProductDto) {
    const product = this.productRepo.create({
      ...dto,
      isFeatured: dto.isFeatured ? true : false,
      category: { id: dto.categoryId },
    });
    const savedProduct = await this.productRepo.save(product);
    // gọi ImageService để thêm ảnh
    if (listUrl?.length > 0) {
      await this.productImageService.createListProductImage(
        listUrl,
        savedProduct,
      );
    }

    return savedProduct;
  }

  async findAll(query: QueryAllProductDto) {
    const { page = 1, pageSize = 10, search, categoryId } = query;

    const where: any = {};

    where.stock = MoreThanOrEqual(1);

    if (search) where.slug = Like(`%${slugify(search)}%`);

    if (categoryId) where.category = { id: categoryId };

    const [products, total] = await this.productRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      withDeleted: false,
    });

    const dataResult = plainToInstance(ProductDto, products, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const pagination = buildPaginationMeta(
      total,
      products.length,
      page,
      pageSize,
    );

    return { dataResult, pagination };
  }

  async findOne(id: number): Promise<ProductDto> {
    const product = await this.productRepo.findOne({ where: { id } });

    return plainToInstance(ProductDto, product, {
      excludeExtraneousValues: true, // Chỉ lấy field có @Expose
    });
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...updateData } = updateProductDto;

    const product = await this.productRepo.findOneOrFail({ where: { id } });
    product.category = null;
    // merge data mới vào product cũ
    const updatedProduct = this.productRepo.merge(product, {
      ...updateData,
      category: { id: updateData.categoryId },
    });

    // lưu lại DB
    await this.productRepo.save(updatedProduct);

    return updatedProduct;
  }

  softRemove(id: number) {
    // const product = this.productRepo.create({ id });
    // return this.productRepo.remove(product);
    return this.productRepo.softDelete(id);
  }

  async remove(id: number) {
    const product = await this.productRepo.findOneOrFail({ where: { id } });
    if (!product?.deletedAt)
      throw new BadRequestException(
        'Vui lòng tắt hoạt động sản phẩm mới có thể xoá',
      );
    return this.productRepo.remove(product);
  }
}
