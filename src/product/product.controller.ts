import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  LoggerService,
  Inject,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { Product } from './entities/product.entity';
import { ProductDto } from './dto/product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/common/config/upload.config';
import * as fs from 'fs';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { QueryAllProductDto } from './dto/query-all-product.dto';
import { ProductsService } from './product.service';

@Controller('product')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('/admin/')
  async findAllAdmin(@Query() query: QueryAllProductDto) {
    const { dataResult, pagination } =
      await this.productsService.findAllAdmin(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách sản phẩm thành công',
    );
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 3, { storage: storageConfig('product') }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<ApiCustomResponse<Product | string>> {
    if (files.length <= 0)
      throw new BadRequestException('Sản phẩm phải có ít nhất 1 ảnh');
    try {
      const listUrl: string[] = files.map((file) => file.path);
      const product = await this.productsService.create(
        listUrl,
        createProductDto,
      );

      return ApiCustomResponse.success(
        HttpStatus.CREATED,
        product,
        'Tạo sản phẩm thành công',
      );
    } catch (error) {
      for (const file of files) {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          this.logger.error({
            message: 'Không thể xóa file',
            file: file.path,
            e,
          });
        }
      }
      throw error;
    }
  }

  @Get()
  async findAll(@Query() query: QueryAllProductDto) {
    const { dataResult, pagination } =
      await this.productsService.findAll(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách sản phẩm thành công',
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiCustomResponse<ProductDto>> {
    const product = await this.productsService.findOne(id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      product,
      'Lấy chi tiết sản phẩm thành công',
    );
  }

  @Patch()
  async update(@Body() updateProductDto: UpdateProductDto) {
    const product = await this.productsService.update(updateProductDto);

    return ApiCustomResponse.success(
      HttpStatus.OK,
      product,
      'Chỉnh sửa sản phẩm thành công',
    );
  }

  @Delete('soft-delete/:id')
  async softRemove(@Param('id', ParseIntPipe) id: number) {
    const dataDelete = await this.productsService.softRemove(id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      dataDelete,
      'Xoá mềm sản phẩm thành công',
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const dataDelete = await this.productsService.remove(id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      dataDelete,
      'Xoá sản phẩm thành công',
    );
  }
}
