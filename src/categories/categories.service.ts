import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { IsNull, Like, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { slugify } from 'src/common/utils/slug.util';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findWeb() {
    return this.categoryRepo.find({
      where: { pid: IsNull() },
      relations: ['children'], 
    });
  }

  async findAll(query: PaginationDto & { search?: string }) {
    const { page = 1, pageSize = 10, search } = query;

    const [categories, total] = await this.categoryRepo.findAndCount({
      where: search ? { slug: Like(`%${slugify(search)}%`) } : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
      withDeleted: false,
    });

    const pagination = buildPaginationMeta(
      total,
      categories.length,
      page,
      pageSize,
    );

    return { dataResult: categories, pagination };
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
