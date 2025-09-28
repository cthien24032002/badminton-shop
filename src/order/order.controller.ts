import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { QueryFindOrder } from './dto/query-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const dataResult = await this.orderService.create(createOrderDto);
    return ApiCustomResponse.success(
      HttpStatus.CREATED,
      dataResult,
      'create order successfully',
    );
  }

  @Get('/admin')
  async findAllForAdmin(@Query() query: QueryFindOrder) {
    const { dataResult, pagination } =
      await this.orderService.findAllForAdmin(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách order thành công',
    );
  }

  @Get()
  async findAllForUser(@Query() query: QueryFindOrder) {
    const { dataResult, pagination } =
      await this.orderService.findAllForUser(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách order thành công',
    );
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.orderService.findOne(id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      order,
      `get order with id ${id} successfully`,
    );
  }

  // @Patch(':id')
  // async update(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto) {
  //   const dataResult = await this.orderService.update(id, updateOrderDto);
  //   return ApiCustomResponse.success(HttpStatus.OK, dataResult, 'update order successfully');
  // }

  // @Delete(':id')
  // async remove(@Param('id', ParseIntPipe) id: number) {
  //   await this.orderService.remove(id);
  //   return ApiCustomResponse.success(HttpStatus.OK, null, 'delete order successfully');
  // }
}
