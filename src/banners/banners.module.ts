import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Banner])],
  controllers: [BannersController],
  providers: [BannersService],
})
export class BannersModule {}
