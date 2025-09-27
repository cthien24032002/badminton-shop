import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateImageProductDto } from './dto/create-image-product.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepo: Repository<ProductImage>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  create(fileName: string, createDto: CreateImageProductDto) {
    const imagesCreate = this.productImageRepo.create({
      imageUrl: fileName,
      product: { id: createDto.id },
    });

    return this.productImageRepo.save(imagesCreate);
  }

  createListProductImage(fileNames: string[], product: Product) {
    // Tạo mảng entity ProductImage từ list fileName
    const imagesCreate = fileNames.map((fileName) =>
      this.productImageRepo.create({
        imageUrl: fileName,
        product, // gắn product vào từng ảnh
      }),
    );

    // Lưu tất cả cùng lúc
    return this.productImageRepo.save(imagesCreate);
  }

  async removeProductImage(id: number) {
    // Lấy entity theo ID
    const image = await this.productImageRepo.findOne({ where: { id } });
    if (!image) {
      throw new NotFoundException(`Image with ID ${id} not found`);
    }

    // Xóa trong DB
    await this.productImageRepo.remove(image);

    // Sau khi DB xóa thành công thì xóa file trong hệ thống
    await fs.promises.unlink(image.imageUrl);
  }
}
