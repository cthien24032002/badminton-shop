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
} from '@nestjs/common';
import { OrderItemService } from './order-item.service';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const dataResult = await this.orderItemService.findOne(id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      dataResult,
      `get order item with id ${id} successfully`,
    );
  }

}
