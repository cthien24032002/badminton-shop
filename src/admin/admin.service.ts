import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { QueryAllAdminDto } from './dto/find-all-admin.dto';
import { slugify } from 'src/common/utils/slug.util';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import { plainToInstance } from 'class-transformer';
import { AdminDto } from './dto/admin.dto';
import { UpdateStatusDto } from './dto/update-status-admin.dto';
import { hashPassword } from 'src/common/utils/password.util';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private readonly adminRepo: Repository<Admin>,
  ) {}

  findOnePhone(phone: string) {
    return this.adminRepo.findOne({ where: { phone } });
  }

  async create(createDto: CreateAdminDto) {
    const hash = await hashPassword(createDto.password)
    const createAdmin = this.adminRepo.create({...createDto,password:hash})
    return this.adminRepo.save(createAdmin);
  }

  async update(id: number, updateDto: UpdateAdminDto) {
    const createAdmin = await this.adminRepo.findOneByOrFail({id})
    const saveAdmin = await this.adminRepo.merge(createAdmin,updateDto)
    return this.adminRepo.save(saveAdmin);
  }

  async findOne(id: number) {
    const admin = await this.adminRepo.findOneOrFail({ where: { id } });
    return plainToInstance(AdminDto, admin, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }

  async findAll(query: QueryAllAdminDto) {
    const { page = 1, pageSize = 10, search, role } = query;
    const where: FindOptionsWhere<Admin>[] = [];

    // --- Filter theo role ---
    if (role) {
      if (search) {
        const keyword = slugify(search);

        where.push(
          { role, slug: Like(`%${keyword}%`) },
          { role, email: Like(`%${search}%`) },
          { role, name: Like(`%${search}%`) },
        );
      } else {
        where.push({ role });
      }
    } else if (search) {
      const keyword = slugify(search);

      where.push(
        { slug: Like(`%${keyword}%`) },
        { email: Like(`%${search}%`) },
        { name: Like(`%${search}%`) },
      );
    }
    const [admins, total] = await this.adminRepo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const dataResult = plainToInstance(AdminDto, admins, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });

    const pagination = buildPaginationMeta(
      total,
      dataResult.length,
      page,
      pageSize,
    );

    return { dataResult, pagination };
  }

  updateStatus (id:number,dataUpdate : UpdateStatusDto) {
    const {isActive} = dataUpdate
    return this.adminRepo.update(id,{isActive})
  }

  // updatePassword (id:number,dataUpdate : UpdateStatusDto) {
  //   const {isActive} = dataUpdate
  //   return this.adminRepo.update(id,{isActive})
  // }
}
