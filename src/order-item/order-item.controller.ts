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
    return ApiCustomResponse.success(HttpStatus.CREATED, dataResult, "create order item successfully");
  }

  @Get()
  async findAll() {
    const dataResult = await this.orderItemService.findAll();
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, "get all order items successfully");
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number ) {
    const dataResult = await this.orderItemService.findOne(id);
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, `get order item with id ${id} successfully`);
 
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderItemDto: UpdateOrderItemDto) {
    const dataResult = await this.orderItemService.update(id, updateOrderItemDto);
    return ApiCustomResponse.success(HttpStatus.OK, dataResult, 'update order item successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.orderItemService.remove(id);
    return ApiCustomResponse.success(HttpStatus.OK, null, 'delete order item successfully');
  }
}
