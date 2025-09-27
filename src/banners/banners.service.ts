import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import * as fs from 'fs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(Banner) private readonly bannerRepo: Repository<Banner>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(createBannerDto: CreateBannerDto, fileName: string) {
    const banner = this.bannerRepo.create({
      ...createBannerDto,
      image: fileName,
    });

    return this.bannerRepo.save(banner);
  }

  async findAll(query: PaginationDto) {
    const { page = 1, pageSize = 10 } = query;

    const where: any = {};

    const [banners, total] = await this.bannerRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // const dataResult = plainToInstance(CategoryDto, banners, {
    //   excludeExtraneousValues: true,
    //   enableImplicitConversion: true,
    // });

    const pagination = buildPaginationMeta(
      total,
      banners.length,
      page,
      pageSize,
    );

    return { dataResult: banners, pagination };
  }

  findOne(id: number) {
    return `This action returns a #${id} banner`;
  }

  async update(updateBannerDto: UpdateBannerDto) {
    console.log(updateBannerDto);

    // Lấy banner cũ, nếu không có thì tự throw EntityNotFoundError
    const banner = await this.bannerRepo.findOneOrFail({
      where: { id: updateBannerDto.id },
    });

    // Gộp dữ liệu cũ và mới
    const bannerUpdate = await this.bannerRepo.merge(banner, updateBannerDto);

    // Lưu lại
    return this.bannerRepo.save(bannerUpdate);
  }

  async updateImage(id: number, fileName: string) {
    const banner = await this.bannerRepo.findOneOrFail({ where: { id } });

    // Nếu có ảnh cũ thì xóa
    if (banner.image) {
      try {
        await fs.promises.unlink(banner.image);
      } catch (err) {
        this.logger?.error({
          message: 'Không thể xóa file khi xoá banner',
          file: banner.image,
          err,
        });
      }
    }

    // Merge và lưu lại
    this.bannerRepo.merge(banner, { image: fileName });
    return this.bannerRepo.save(banner);
  }

  async removeImage(id: number) {
    const banner = await this.bannerRepo.findOneOrFail({ where: { id } });

    // Xóa file nhưng không ảnh hưởng endpoint nếu lỗi
    if (banner.image) {
      try {
        await fs.promises.unlink(banner.image);
      } catch (err) {
        this.logger?.error({
          message: 'Không thể xóa file khi xoá banner',
          file: banner.image,
          err,
        });
      }
    }

    banner.image = null;
    // update trong DB
    return this.bannerRepo.save(banner);
  }

  async remove(id: number) {
    // Lấy entity theo ID
    const banner = await this.bannerRepo.findOneOrFail({ where: { id } });

    // Xóa trong DB
    await this.bannerRepo.remove(banner);

    if (banner.image) {
      try {
        await fs.promises.unlink(banner.image);
      } catch (err) {
        // Nếu file không tồn tại hoặc lỗi IO thì log nhưng không chặn tiến trình
        console.warn(`Không thể xóa file: ${banner.image}`, err.message);
      }
    }
  }
}
