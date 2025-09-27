import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from 'src/banners/entities/banner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BannerSeed {
  constructor(
    @InjectRepository(Banner)
    private readonly bannerRepo: Repository<Banner>,
  ) {}

  async run() {
    await this.bannerRepo.query('SET FOREIGN_KEY_CHECKS = 0;');
    await this.bannerRepo.query('TRUNCATE TABLE banners;');
    await this.bannerRepo.query('SET FOREIGN_KEY_CHECKS = 1;');

    const banners = await Promise.all([
      {
        title: "Banner 1",
        image:"https://theme.hstatic.net/200000898999/1001328848/14/ms_banner_img4.jpg?v=51"
      },
      {
        title: "Banner 2",
        image:"https://theme.hstatic.net/200000898999/1001328848/14/ms_banner_img5.jpg?v=51"
      },
    ]);

    const bannerCreate = this.bannerRepo.create(banners);
    await this.bannerRepo.save(bannerCreate);

    console.log('✅ banners seeded!');
  }
}
