import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CategoryDto } from './dto/category.dto';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/common/config/upload.config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { withFileRollback } from 'src/common/utils/with-file-rollback';
import { SearchDto } from 'src/common/dto/search.sto';

@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  // SITE PUBLIC

  @Get('all')
  async getAll() {
    const categories = await this.categoriesService.getAll();
    return ApiCustomResponse.success(
      HttpStatus.OK,
      categories,
      'Lấy danh mục thành công',
    );
  }

  // SITE ADMIN

  @Get('/check/:id')
  async checkCategory (@Param('id') id: string,)  {
      const message = await this.categoriesService.checkCategories(+id);

    return ApiCustomResponse.success(
      HttpStatus.OK,
      message,
      'Kiểm tra danh mục thành công',
    );
  }


  @Get()
  async findAll(@Query() query: PaginationDto & SearchDto) {
    const { dataResult, pagination } =
      await this.categoriesService.findAll(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh mục thành công',
    );
  }

  @Patch(':id')
  update(@Body() caregory: UpdateCategoryDto) {

     return ApiCustomResponse.success(
      HttpStatus.NO_CONTENT,
      caregory,
      'Chỉnh sửa danh mục thành công',
    );
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('categories') }),
  )
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return withFileRollback(
      file,
      async () => {
        const fileName = file ? file.path : undefined;
        const category = await this.categoriesService.create(
          fileName,
          createCategoryDto,
        );

        return ApiCustomResponse.success(
          HttpStatus.OK,
          category,
          'Tạo thành công danh mục sản phẩm',
        );
      },
      this.logger,
    );
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiCustomResponse<CategoryDto>> {
    const category = await this.categoriesService.findOne(+id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      category,
      'Lấy danh mục thành công',
    );
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.remove(id);
    return ApiCustomResponse.success(
      HttpStatus.NO_CONTENT,
      null,
      'Xoá danh mục thành công',
    );
  }

  @Delete('image/:id')
  async removeImage(@Param('id', ParseIntPipe) id: number) {
    await this.categoriesService.removeImage(id);
    return ApiCustomResponse.success(
      HttpStatus.NO_CONTENT,
      null,
      'Xoá hình ảnh thành công',
    );
  }

  @Patch('image/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('categories') }),
  )
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return withFileRollback(
      file,
      async () => {
        if (file) new NotFoundException('File ảnh không tồn tại');
        const fileName = file.path;
        const updateCategory = await this.categoriesService.updateImage(
          fileName,
          id,
        );

        return ApiCustomResponse.success(
          HttpStatus.OK,
          updateCategory,
          'Tạo hình ảnh danh mục sản phẩm thành công',
        );
      },
      this.logger,
    );
  }
}
