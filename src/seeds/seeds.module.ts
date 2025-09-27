// src/seeds/seed.module.ts
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CategorySeed } from './category.seed';
import { getEnv } from 'src/common/config/env.config';
import { Admin } from 'src/admin/entities/admin.entity';
import { AdminSeed } from './admin.seed';
import { User } from 'src/user/entities/user.entity';
import { UserSeed } from './user.seed';
import { BannerSeed } from './banner.seed';
import { Banner } from 'src/banners/entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,Admin,User,Banner])],
  providers: [CategorySeed, AdminSeed,UserSeed,BannerSeed]
})
export class SeedModule implements OnApplicationBootstrap {
  constructor(
    private readonly categorySeed: CategorySeed,
    private readonly adminSeed: AdminSeed,
    private readonly userSeed: UserSeed,
    private readonly bannerSeed: BannerSeed,
  ) {}

  async onApplicationBootstrap() {
    console.log(getEnv('NODE_ENV'));

    if (getEnv('NODE_ENV') !== 'production') {
      console.log('🚀 Running seed...');
      // await this.roleSeed.run();
      // await this.bannerSeed.run();

      await this.userSeed.run();
      await this.adminSeed.run();
      
      // await this.categorySeed.run();
      // await this.productSeed.run();
      console.log('✅ Seed finished');
    }
  }
}
