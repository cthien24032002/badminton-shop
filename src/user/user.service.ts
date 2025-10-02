import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { hashPassword } from 'src/common/utils/password.util';
import { CreateUserDto } from './dto/req/create-user.dto';
import { UpdateUserDto } from './dto/req/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { PublicUserDto } from './dto/res/public-user.dto';
import {
  PaginationDto,
  PaginationServiceType,
} from 'src/common/dto/pagination.dto';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import { ApiCustomResponse } from 'src/common/response/ApiRespone';
import { QueryFindUser } from './dto/req/find-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // ✅ 1. Kiểm tra phone đã tồn tại
    const existingUser = await this.userRepo.findOne({
      where: { phone: createUserDto.phone },
    });
    if (existingUser) {
      throw new BadRequestException('Số điện thoại đã tồn tại');
    }

    // ✅ 2. Tạo user mới
    const user = this.userRepo.create(createUserDto);

    // ✅ 3. Lưu vào DB
    return await this.userRepo.save(user);
  }

  async findAll(query: PaginationDto) {
    const { page = 1, pageSize = 10 } = query;

    const [users, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const dataResult = plainToInstance(PublicUserDto, users, {
      excludeExtraneousValues: true,
    });

    const pagination = buildPaginationMeta(total, users.length, page, pageSize);

    return { dataResult, pagination };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    const dataPlain = plainToInstance(PublicUserDto, user, {
      excludeExtraneousValues: true,
    });
    return ApiCustomResponse.success(
      HttpStatus.OK,
      dataPlain,
      'Lấy người dùng thành công',
    );
  }

  // Sử dụng cho auth
  async findOnePhone(phone: string) {
    const user = await this.userRepo.findOne({
      where: { phone },
      // select: ['id', 'phone', 'name', 'isActive'],
    });

    return user;
  }
  //  Dùng filter
  async findUser(
    query: QueryFindUser,
  ): Promise<PaginationServiceType<PublicUserDto[]>> {
    const { page = 1, pageSize = 10 } = query;

    const where: any = {};
    if (query.phone) where.phone = query.phone;
    if (query.name) where.slug = Like(`%${query.name}%`);
    if (query.email) where.email = query.email;
    if (query.isActive) where.isActive = query.isActive;

    const [users, total] = await this.userRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
    });

    const dataResult = plainToInstance(PublicUserDto, users, {
      excludeExtraneousValues: true,
    });

    const pagination = buildPaginationMeta(total, users.length, page, pageSize);

    return { dataResult, pagination };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
