import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus,ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';


@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const dataResult = await this.orderService.create(createOrderDto); 
    return ApiCustomResponse.success(HttpStatus.CREATED, dataResult,"thêm đơn hàng thành công");
  }
  
  @Get()
  async findAll() {
    const dataResult =await this.orderService.findAll();
    return ApiCustomResponse.success(HttpStatus.OK, dataResult,"lấy tất cả đơn hàng thành công");
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number) {
    const order =  await this.orderService.findOne(id);
    return ApiCustomResponse.success(HttpStatus.OK, order,`lấy đơn hàng với id bằng ${id} thành công`);
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
    const dataResult = await this.orderService.update(id, updateOrderDto);
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, 'sửa đơn hàng thành công');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.orderService.remove(id);
    return ApiCustomResponse.success(HttpStatus.OK, null, 'xoá đơn hàng thành công');
  }
}
