import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Like, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoryDto } from './dto/category.dto';
import { plainToInstance } from 'class-transformer';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import { SearchDto } from 'src/common/dto/search.sto';
import { slugify } from 'src/common/utils/slug.util';
import * as fs from 'fs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly cateRepo: Repository<Category>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  create(fileName: string | undefined, dto: CreateCategoryDto) {
    const categoryData = this.cateRepo.create({
      name: dto.name,
      image: fileName,
      pid: dto.pid ? ({ id: dto.pid } as Category) : undefined,
    });
    return this.cateRepo.save(categoryData);
  }

  async findAll(query: PaginationDto & SearchDto) {
    const { page = 1, pageSize = 10, search } = query;

    const where: any = {};
    where.pid = IsNull();
    if (search) where.slug = Like(`%${slugify(search)}%`);

    const [categories, total] = await this.cateRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      relations: ['children'],
    });

    const dataResult = plainToInstance(CategoryDto, categories, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const pagination = buildPaginationMeta(
      total,
      categories.length,
      page,
      pageSize,
    );

    return { dataResult, pagination };
  }

  async getAll() {
    const where: any = {};
    where.pid = IsNull();
    // if ( search) where.slug = Like(`%${slugify(search)}%`)

    const products = await this.cateRepo.find({
      where,
      relations: ['children'],
    });

    const dataResult = plainToInstance(CategoryDto, products, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    return dataResult;
  }

  async findOne(id: number): Promise<CategoryDto> {
    const category = await this.cateRepo.findOneOrFail({ where: { id } });

    return plainToInstance(CategoryDto, category, {
      excludeExtraneousValues: true, // Chỉ lấy field có @Expose
    });
  }

  async remove(id: number) {
    // Lấy danh mục + children
    const category = await this.cateRepo.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!category) {
      throw new NotFoundException(`Danh mục với ID ${id} không tồn tại`);
    }

    // Xóa children trước (đệ quy)
    if (category.children && category.children.length > 0) {
      for (const child of category.children) {
        await this.remove(child.id); // gọi lại chính hàm này cho từng child
      }
    }

    // Xóa file ảnh của category (nếu có)
    if (category.image) {
      try {
        await fs.promises.unlink(category.image);
      } catch (err) {
        this.logger?.error({
          message: 'Không thể xóa file khi xoá danh mục',
          file: category.image,
          err,
        });
      }
    }

    // Cuối cùng xóa chính category
    await this.cateRepo.remove(category);
  }

  async update({ id, name, pid }: UpdateCategoryDto) {
    const category = await this.cateRepo.findOneOrFail({ where: { id } });

    const categoryUpdated = this.cateRepo.merge(category, {
      name,
      pid: pid === undefined ? undefined : pid === null ? null : { id: pid },
    });

    return this.cateRepo.save(categoryUpdated);
  }

  async removeImage(id: number) {
    const category = await this.cateRepo.findOneOrFail({ where: { id } });

    // Xóa file nhưng không ảnh hưởng endpoint nếu lỗi
    if (category.image) {
      try {
        await fs.promises.unlink(category.image);
      } catch (err) {
        this.logger?.error({
          message: 'Không thể xóa file khi xoá danh mục',
          file: category.image,
          err,
        });
      }
    }

    category.image = null;
    // update trong DB
    return this.cateRepo.save(category);
  }

  async updateImage(fileName: string, id: number) {
    const category = await this.cateRepo.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    category.image = fileName;
    return this.cateRepo.save(category);
  }

  async checkCategories(id: number) {
    const category = await this.cateRepo.findOneOrFail({
      where: { id },
      relations: ['children', 'children.products', 'products'], // load products của con luôn
    });
    console.log(category)
    const childrenCount = category.children?.length || 0;
    const productCount = category.products?.length || 0;

    // tính tổng sản phẩm của các mục con
    let totalProductsInChildren = 0;
    if (category.children && category.children.length > 0) {
      totalProductsInChildren = category.children.reduce((sum, child) => {
        return sum + (child.products?.length || 0);
      }, 0);
    }

    // thông báo
    if (
      childrenCount > 0 &&
      (productCount > 0 || totalProductsInChildren > 0)
    ) {
      return `Danh mục này có ${childrenCount} mục con và ${productCount + totalProductsInChildren} sản phẩm (kể cả trong mục con). Xoá sẽ xoá hết.`;
    } else if (childrenCount > 0) {
      return `Danh mục này có ${childrenCount} mục con. Xoá sẽ xoá toàn bộ mục con.`;
    } else if (productCount > 0) {
      return `Danh mục này có ${productCount} sản phẩm. Xoá có thể ảnh hưởng tới sản phẩm.`;
    } else {
      return `Danh mục ${category.name} trống. Bạn có chắc muốn xoá không?`;
    }
  }
}
