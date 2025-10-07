import { Injectable } from '@nestjs/common';
import { CreateCustomerRequestDto } from './dto/create-customer-request.dto';
import { UpdateCustomerRequestStatusDto } from './dto/update-customer-request-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerRequest } from './entities/customer-request.entity';
import { ILike, Repository } from 'typeorm';
import { buildPaginationMeta } from 'src/common/utils/pagination.util';
import { QueryFindRequest } from './dto/query-customer-request.dto';

@Injectable()
export class CustomerRequestService {
  constructor(
    @InjectRepository(CustomerRequest)
    private readonly customerRequestRepo: Repository<CustomerRequest>,
  ) {}

  create(createCustomerRequestDto: CreateCustomerRequestDto) {
    const requestCreate = this.customerRequestRepo.create(
      createCustomerRequestDto,
    );
    return this.customerRequestRepo.save(requestCreate);
  }

  async findAll(query: QueryFindRequest) {
    const { page = 1, pageSize = 10, search, requestStatus } = query;
    const where: any = {};
    // Tìm kiếm theo tên hoặc số điện thoại
    if (search) {
      where.$or = [
        { slug: ILike(`%${search}%`) },
        { phone: ILike(`%${search}%`) },
      ];
    }

    // Lọc theo trạng thái
    if (requestStatus) {
      where.status = requestStatus;
    }

    const [requests, total] = await this.customerRequestRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where,
      order: { createdAt: 'DESC' },
    });

    const pagination = buildPaginationMeta(
      total,
      requests.length,
      page,
      pageSize,
    );
    return { dataResult: requests, pagination };
  }

  findOne(id: number) {
    return this.customerRequestRepo.findOneByOrFail({ id });
  }

  update(id: number, updateCustomerRequestDto: UpdateCustomerRequestStatusDto) {
    return this.customerRequestRepo.update(id,{...updateCustomerRequestDto });
  }
}
