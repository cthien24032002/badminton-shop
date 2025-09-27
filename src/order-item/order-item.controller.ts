import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  async create(@Body() createOrderItemDto: CreateOrderItemDto) {
    const dataResult = await this.orderItemService.create(createOrderItemDto);
    return ApiCustomResponse.success(HttpStatus.CREATED, dataResult, "thêm sản phẩm đơn hàng thành công");
  }

  @Get()
  async findAll() {
    const dataResult = await this.orderItemService.findAll();
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, "lấy tất cả sản phẩm đơn hàng thành công");
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number ) {
    const dataResult = await this.orderItemService.findOne(id);
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, `lấy sản phẩm đơn hàng với id bằng ${id} thành công`);
 
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderItemDto: UpdateOrderItemDto) {
    const dataResult = await this.orderItemService.update(id, updateOrderItemDto);
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, 'sửa sản phẩm đơn hàng thành công');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.orderItemService.remove(id);
    return ApiCustomResponse.success(HttpStatus.OK, null, 'xoá sản phẩm đơn hàng thành công');
  }
}
