import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { QueryFindUser } from './dto/req/find-user.dto';
import { NumberIdDto } from 'src/common/dto/id-number.dto';
import { Not } from 'typeorm';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const createdData = await this.userService.create(createUserDto);
    return ApiCustomResponse.success(
      HttpStatus.OK,
      createdData,
      'User created successfully',
    );
  }

  @Get()
  async findAll(@Query() query: PaginationDto) {
    const { dataResult, pagination } = await this.userService.findAll(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách người dùng thành công',
    );
  }

  @Get('find')
  async findUser(@Query() query: QueryFindUser) {
    const { dataResult, pagination } = await this.userService.findUser(query);

    return ApiCustomResponse.paginated(
      HttpStatus.OK,
      dataResult,
      pagination,
      'Lấy danh sách người dùng thành công',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const update = await this.userService.update(id, updateUserDto);
    if (update.affected === 0)
      throw new BadRequestException(
        `Người dùng không tồn tại hoặc không thể cập nhật`,
      );
    return ApiCustomResponse.success(
      HttpStatus.OK,
      undefined,
      'Cập nhật người dùng thành công',
    );
  }

  // @Delete(':id')
  // remove(@Param('id',ParseIntPipe) id: number) {
  //   return this.userService.remove(id);
  // }
}
