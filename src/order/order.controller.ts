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
  UseInterceptors,
  UploadedFile,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { QueryFindOrder } from './dto/query-order.dto';
import { UpdateStatusOrderDto } from './dto/update-status.dto';
import { OrderStatus } from 'src/common/enums';
import { ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/common/config/upload.config';
import { UpdateImageOrderDto } from './dto/update-image.dto';
import { withFileRollback } from 'src/common/utils/with-file-rollback';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}


  @Delete('/image/:id')
  async removeOrderImage(@Param('id', ParseIntPipe) id: number) {
    await this.orderService.removeImage(id);
    return ApiCustomResponse.success(
      HttpStatus.NO_CONTENT,
      null,
      'Xoá hình ảnh chuyển khoản thành công',
    );
  }

  @Post('/image/')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', { storage: storageConfig('orders') }),
  )
  async createImageOrder(
    @Body() createDto: UpdateImageOrderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return withFileRollback(
      file,
      async () => {
        if(!file) throw new BadRequestException('Vui lòng gửi hình ảnh chuyển khoản') 
        const fileName = file.path;
        const orderImage = await this.orderService.createOrderImage(fileName, createDto);

        return ApiCustomResponse.success(
          HttpStatus.OK,
          orderImage,
          'Gửi thành công hình ảnh chuyển khoản',
        );
      },
      this.logger,
    );
  }

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.orderService.findOne(+id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      order,
      `Lấy thông tin đơn hàng thành công`,
    );
  }

  @Get('/total/:orderStatus')
  async findTotal(@Param('orderStatus') orderStatus: OrderStatus) {
    const order = await this.orderService.findTotal(orderStatus);
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
