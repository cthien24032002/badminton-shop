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
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { QueryAllAdminDto } from './dto/find-all-admin.dto';
import { handlerApi, handlerApiFind } from 'src/common/utils/response-api';
import { UpdateStatusDto } from './dto/update-status-admin.dto';
import { UpdatePasswordAdminDto } from './dto/update-password-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async create(@Body() createAdminDto: CreateAdminDto) {
    const admin = await this.adminService.create(createAdminDto);
    return handlerApi(admin, HttpStatus.OK, 'Tạo Admin thành công');
  }

  @Get()
  async findAll(@Query() query: QueryAllAdminDto) {
    const admins = await this.adminService.findAll(query);
    return handlerApiFind(
      admins,
      HttpStatus.OK,
      'Lấy danh sách Admin thành công',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const admin = await this.adminService.findOne(+id);
    return handlerApi(admin, HttpStatus.OK, 'Lấy chi tiết Admin thành công');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    const admin = this.adminService.update(+id, updateAdminDto);
    return handlerApi(admin, HttpStatus.OK, 'Sửa Admin thành công');
  }

  @Patch(':id')
  async updatePassword(@Param('id') id: string, @Body() updateAdminDto: UpdatePasswordAdminDto){
    const admin = await this.adminService.updatePassword(+id, updateAdminDto);
    return handlerApi(admin, HttpStatus.OK, 'Sửa mật khẩu Admin thành công');
  }

  @Delete('/active/:id')
  async remove(@Param('id') id: string,@Body() dataUpdate : UpdateStatusDto) {
    const update = await this.adminService.updateStatus(+id,dataUpdate);
    if(!update.affected)  throw new BadRequestException('Không thể chỉnh sửa trạng thái admin')
    return handlerApi(null,HttpStatus.OK,'Chỉnh sửa trạng thái admin thành công')
  }

  
}
