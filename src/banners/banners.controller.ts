import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpStatus,
  Inject,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { storageConfig } from 'src/common/config/upload.config';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import * as fs from 'fs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PaginationDto } from 'src/common/dto/pagination.dto';



@Controller('banners')
export class BannersController {
  constructor(
    private readonly bannersService: BannersService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('banner') }),
  )
  async create(
    @Body() createBannerDto: CreateBannerDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Banner image là bắt buộc');
    }
    try {
      const fileName = file.path;
      const banner = await this.bannersService.create(
        createBannerDto,
        fileName,
      );
      return ApiCustomResponse.success(
        HttpStatus.CREATED,
        banner,
        'Thêm banner thành công',
      );
    } catch (error) {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        this.logger.error({
          message: 'Không thể xóa fil banners',
          file: file.path,
          e,
        });
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    const { dataResult, pagination } = await this.bannersService.findAll(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy banner thành công',
    );
  }

  @Delete('image/:id')
  async removeImage(@Param('id', ParseIntPipe) id: number) {
    await this.bannersService.removeImage(id);
    return ApiCustomResponse.success(
      HttpStatus.NO_CONTENT,
      null,
      'Xoá hình ảnh thành công',
    );
  }

  @Patch('image/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('banner') }),
  )
  async updateImage(
    @Param('id',ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Banner image là bắt buộc');
    }
    try {
      const fileName = file.path;
      const banner = await this.bannersService.updateImage(id, fileName);
      return ApiCustomResponse.success(
        HttpStatus.CREATED,
        banner,
        'Thêm banner thành công',
      );
    } catch (error) {
      try {
        fs.unlinkSync(file.path);
      } catch (e) {
        this.logger.error({
          message: 'Không thể xóa fil banners',
          file: file.path,
          e,
        });
      }
      throw error;
    }
  }

  @Patch()
  async update(@Body()updateBannerDto: UpdateBannerDto) {
    const banner = await this.bannersService.update(updateBannerDto);
    return ApiCustomResponse.success(
      HttpStatus.CREATED,
      banner,
      'Chỉnh sửa banner thành công',
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const banner = await this.bannersService.remove(id);
    return ApiCustomResponse.success(
      HttpStatus.NO_CONTENT,
      undefined,
      'Xoá banner thành công',
    );
  }
}
