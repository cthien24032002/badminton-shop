import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';

import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/common/config/upload.config';
import { withFileRollback } from 'src/common/utils/with-file-rollback';
import { CreateImageProductDto } from './dto/create-image-product.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@ApiBearerAuth()
@Controller('images')
export class ImagesController {
  constructor(
    private readonly imagesService: ImagesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('product') }),
  )
  async create(
    @Body() createDto: CreateImageProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return withFileRollback(
      file,
      async () => {
        const fileName = file.path;
        const category = await this.imagesService.create(fileName, createDto);

        return ApiCustomResponse.success(
          HttpStatus.OK,
          category,
          'Tạo thành công hình ảnh sản phẩm',
        );
      },
      this.logger,
    );
  }

  @Delete(':id')
  async removeProductImage(@Param('id', ParseIntPipe) id: number) {
    await this.imagesService.removeProductImage(id);
    return ApiCustomResponse.success(
      HttpStatus.NO_CONTENT,
      null,
      'Xoá hình ảnh thành công',
    );
  }
}
