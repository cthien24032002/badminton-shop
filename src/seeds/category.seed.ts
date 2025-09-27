import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class CategorySeed {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async run() {
    // Xóa sạch data cũ
    await this.categoryRepo.query('SET FOREIGN_KEY_CHECKS = 0;');
    await this.categoryRepo.query('TRUNCATE TABLE categories;');
    await this.categoryRepo.query('SET FOREIGN_KEY_CHECKS = 1;');

    // --- tạo danh mục cha ---
    const moto = this.categoryRepo.create({ name: 'Xe máy' });
    const car = this.categoryRepo.create({ name: 'Ô tô' });
    await this.categoryRepo.save([moto, car]);

    // --- tạo danh mục con ---
    const children = this.categoryRepo.create([
      { name: 'Phụ tùng xe máy', pid: moto },
      { name: 'Dầu nhớt xe máy', pid: moto },
      { name: 'Phụ tùng ô tô', pid: car },
      { name: 'Đồ chơi ô tô', pid: car },
      { name: 'Mũ bảo hiểm', pid: undefined }, // danh mục gốc khác
    ]);

    await this.categoryRepo.save(children);

    console.log('✅ Categories seeded!');
  }
}
