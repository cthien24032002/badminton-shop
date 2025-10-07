import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus, BadRequestException,
} from '@nestjs/common';
import { CustomerRequestService } from './customer-request.service';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { UpdateCustomerRequestStatusDto } from './dto/update-customer-request-status.dto';
import { QueryFindRequest } from './dto/query-customer-request.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';

@Controller('customer-request')
export class CustomerRequestController {
  constructor(
    private readonly customerRequestService: CustomerRequestService,
  ) {}

  @Post()
  async create(@Body() createCustomerRequestDto: CreateCustomerRequestDto) {
    const dataResult = await this.customerRequestService.create(
      createCustomerRequestDto,
    );
    return ApiCustomResponse.success(
      HttpStatus.CREATED,
      dataResult,
      'Gửi yêu cầu thành công',
    );
  }

  @Get()
  async findAll(@Body() query: QueryFindRequest) {
    const { dataResult, pagination } =
      await this.customerRequestService.findAll(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách yêu cầu thành công',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const request = await this.customerRequestService.findOne(+id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      request,
      `Lấy thông tin yêu cầu thành công`,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerRequestDto: UpdateCustomerRequestStatusDto,
  ) {
    const request = await this.customerRequestService.update(
      +id,
      updateCustomerRequestDto,
    );
    if(!request.affected) throw new BadRequestException('Không thể cập nhập trạng thái yêu cầu')
    return ApiCustomResponse.success(
      HttpStatus.OK,
      null,
      `Cập nhập trạng thái yêu cầu thành công`,
    );
  }
}
