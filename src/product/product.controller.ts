import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
   const dataResult = await this.productService.create(createProductDto);
    return ApiCustomResponse.success(HttpStatus.CREATED, dataResult,"create product successfully");
  }

  @Get()
  async findAll() {
    const dataResult = await this.productService.findAll();
    return ApiCustomResponse.success(HttpStatus.OK, dataResult,"get all products successfully"); 
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number) {
    const dataResult = await this.productService.findOne(id);
    return ApiCustomResponse.success(HttpStatus.OK, dataResult,`get product with id ${id} successfully`);
  }
@Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    const dataResult = await this.productService.update(id, updateProductDto);
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, 'update product successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.productService.remove(id);
    return ApiCustomResponse.success(HttpStatus.OK, null, 'delete product successfully');
  }
}
