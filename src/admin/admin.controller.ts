import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  BadRequestException,
  Query,
  HttpCode,
  Header,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { QueryAllAdminDto } from './dto/find-all-admin.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { UpdateStatusDto } from './dto/update-status-admin.dto';
import { UpdatePasswordAdminDto } from './dto/update-password-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.create(createAdminDto);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      admin,
      'Tạo Admin thành công',
    );
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  // @Header('Cache-Control', 'no-store')
  async findAll(@Query() query: QueryAllAdminDto) {
    const { dataResult, pagination } = await this.adminService.findAll(query);
    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách Admin thành công',
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const admin = await this.adminService.findOne(+id);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      admin,
      'Lấy chi tiết Admin thành công',
    );
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const admin = this.adminService.update(+id, updateAdminDto);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      admin,
      'Sửa Admin thành công',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async updatePassword(@Param('id') id: string, @Body() updateAdminDto: UpdatePasswordAdminDto){
    const admin = await this.adminService.updatePassword(+id, updateAdminDto);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      admin,
      'Sửa mật khẩu Admin thành công',
    );
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/active/:id')
  async remove(@Param('id') id: string,@Body() dataUpdate : UpdateStatusDto) {
    const update = await this.adminService.updateStatus(+id,dataUpdate);
    if(!update.affected)  throw new BadRequestException('Không thể chỉnh sửa trạng thái admin')
    return ApiCustomResponse.success(
      HttpStatus.OK,
      undefined,
      'Chỉnh sửa trạng thái admin thành công',
    );
  }

}