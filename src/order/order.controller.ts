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
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { QueryFindOrder } from './dto/query-order.dto';
import { UpdateStatusOrderDto } from './dto/update-status.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const dataResult = await this.orderService.create(createOrderDto);
    return ApiCustomResponse.success(
      HttpStatus.CREATED,
      dataResult,
      'Tạo đơn hàng thành công',
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
      'Lấy danh sách đơn hàng thành công',
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
      'Lấy danh sách đơn hàng thành công',
    );
  }
  @Get('/total')
  async findTotal() {
    const order = await this.orderService.findTotal();
    return ApiCustomResponse.success(
      HttpStatus.OK,
      order,
      `Lấy thông tin đơn hàng thành công`,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    console.log('haha');
    const order = await this.orderService.findOne(+id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      order,
      `Lấy thông tin đơn hàng thành công`,
    );
  }

  @Patch('/status/:id')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusOrderDto,
  ) {
    const order = await this.orderService.updateStatus(id, updateStatusDto);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      order,
      `cập nhật trạng thái đơn hàng thành công`,
    );
  }
}
